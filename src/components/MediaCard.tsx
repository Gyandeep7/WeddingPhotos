import React from "react";

interface MediaCardProps {
  title: string;
  url: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ title, url }) => {
  return (
    <div className="media-card border rounded p-4 flex flex-col items-center">
      <div className="mb-2 font-semibold text-lg">{title}</div>
      <img
        src={url}
        alt={title}
        className="w-full h-48 object-cover rounded mb-2"
        loading="lazy"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        View Full Photo
      </a>
    </div>
  );
};

export default MediaCard;