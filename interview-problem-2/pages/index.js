import React from 'react';
import Link from 'next/link';

export default function () {
  return (
    <div>
      <Link href='/books'>
        <a>
          <h1>Bookstore</h1>
        </a>
      </Link>
    </div>
  );
};
