import { useState } from "react";

export interface Member {
  name: string;
  mbti: string;
  bio: string;
  image: string;
  hobby: string;
  language: string;
  github: string;
}

interface Props {
  member: Member;
  onClick: () => void;
}

export default function MemberCard({ member, onClick }: Props) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="member-card" onClick={onClick}>
      <img src={member.image} alt={member.name} className="card-img" />
      <h3 className="card-name">{member.name}</h3>
      <span className="card-mbti">{member.mbti}</span>
      <button
        className={`like-btn ${liked ? "liked" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked);
        }}
      >
        {liked ? "♥ 좋아요" : "♡ 좋아요"}
      </button>
    </div>
  );
}
