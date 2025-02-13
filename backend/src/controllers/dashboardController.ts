import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction):Promise <void> => {
  const { timeRange } = req.query;

  let startDate: Date;
  let dateFormat: string;

  switch (timeRange) {
    case '1-day':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      dateFormat = "%H:%M:%S"; 
      break;
    case '1-week':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      dateFormat = "%Y-%m-%d %H:%M"; 
      break;
    case '1-month':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      dateFormat = "%Y-%m-%d"; 
      break;
    case '3-months':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      dateFormat = "%Y-%m-%d"; 
      break;
    case 'all-time':
    default:
      startDate = new Date(0); 
      dateFormat = "%Y-%m-%d"; 
  }

  try {
    const orders = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalPrice" },
        }
      },
      { $sort: { "_id.date": 1 } } 
    ]);

    const formattedOrders = orders.map(order => ({
      date: order._id.date,
      totalOrders: order.totalOrders,
      totalAmount: order.totalAmount
    }));

    res.json(formattedOrders);
  } catch (error) {
    next(error);
  }
};

  export const getProductRanking = async (req: Request, res: Response, next: NextFunction):Promise <void> => {
    try {
      const productStats = await Order.aggregate([
        { $unwind: "$items" }, 
        {
          $group: {
            _id: "$items.productId",
            soldAmount: { $sum: "$items.quantity" },
          },
        },
        { $sort: { soldAmount: -1 } }, 
        { $limit: 10 },
      ]);
  
      const productsWithNames = await Promise.all(
        productStats.map(async (product) => {
          const productData = await Product.findById(product._id).select("name");
          return productData ? { name: productData.name, soldAmount: product.soldAmount } : null;
        })
      );
  
      res.json(productsWithNames.filter(Boolean));
    } catch (error) {
      next(error);
    }
  };

  export const getUserRanking = async (req: Request, res: Response, next: NextFunction):Promise <void> => {
    try {
      const userRanking = await Order.aggregate([
        { $group: { _id: "$email", totalSpent: { $sum: "$totalPrice" } } },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
      ]);
  
      const formattedRanking = userRanking.map(user => ({
        username: user._id, 
        totalSpent: user.totalSpent,
      }));
  
      res.json(formattedRanking);
    } catch (error) {
      next(error);
    }
  };
  
