function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
  return d;
}
export function Percentage(props: { percentage: number }) {
  const { percentage } = props;
  const angle = percentage*360/100;

  const circle = angle === 360? <circle cx="10" cy="10" r="9" fill="none" stroke="#446688" strokeWidth="2" /> :
    <path fill="none" stroke="#446688" strokeWidth="2" d={describeArc(10, 10, 9, 0, angle)} />;
  return (
    <div className="percentage">
      <svg width="100%" viewBox="0 0 20 20">
        {circle}
      </svg>
    </div>
  );
}
