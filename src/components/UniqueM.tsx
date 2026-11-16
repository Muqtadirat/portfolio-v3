import React from 'react';

/* Swap every M/m for the signature italic Newsreader M */
export const withUniqueM = (text: string): React.ReactNode[] =>
  text.split(/(M|m)/).map((part, i) =>
    part === 'M' || part === 'm' ? (
      <span key={i} className="unique-m">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

type UniqueMTextProps = {
  children: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';
};

const UniqueMText = ({
  children,
  className,
  as: Tag = 'span',
}: UniqueMTextProps) => (
  <Tag className={className}>{withUniqueM(children)}</Tag>
);

export default UniqueMText;
