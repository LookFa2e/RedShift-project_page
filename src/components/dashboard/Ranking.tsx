import React from 'react';

interface RankingProps {
  title: string;
  rankingData: { [key: string]: number }[]; 
}

const Ranking: React.FC<RankingProps> = ({ title, rankingData }) => {
  return (
    <div className="ranking">
      <h2>{title}</h2>
      <ul>
        {rankingData.map((item, index) => {
          const [name, value] = Object.entries(item)[0];
          return (
            <li key={index}>
               {value} 
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Ranking;
