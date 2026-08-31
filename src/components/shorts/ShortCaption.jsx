// Bottom-left caption block on a Short — bold title + muted hashtag line.
export default function ShortCaption({ title, hashtags }) {
  return (
    <div className="max-w-[80%]">
      <p className="text-[16px] font-bold text-white leading-tight mb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
        {title}
      </p>
      {hashtags && (
        <p className="text-[13px] text-white/85 leading-[18px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          {hashtags}
        </p>
      )}
    </div>
  );
}
