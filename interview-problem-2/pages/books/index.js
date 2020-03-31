import React from 'react';
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";
import {ApolloProvider, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from 'next/link';
import useState from '../../utils/use-reactive-state';

const client = new ApolloClient({
  uri: "http://localhost:4567/graphql"
});

function Book(props) {
  const {
    bookId,
    title,
    author,
    price,
    onCheckboxChange
  } = props;

  return (
    <div>
      <input
        type='checkbox'
        id={bookId}
        onChange={onCheckboxChange}
      />
      <label htmlFor={bookId}>{title}</label>
      <div>Author: {author}</div>
      <div>Price: {price}</div>
      <Link href='/books/[bookId]' as={`/books/${bookId}`}>
        <a>Edit</a>
      </Link>
      <br />
      <br />
    </div>
  );
}

function Books() {
  const {loading, error, data} = useQuery(gql`
    query {
      books {
        bookId
        title
        author
        price
      }
    }  
  `);
  const state = useState({selectedBooks: []});

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>An error occured.</p>;
  }

  const books = data.books.map(({
    bookId,
    title,
    author,
    price
  }) => (
    <Book
      key={bookId}
      bookId={bookId}
      title={title}
      author={author}
      price={price}
      onCheckboxChange={function (event) {
        if (event.target.checked) {
          state.selectedBooks = [
            ...state.selectedBooks, {
              bookId,
              title,
              author,
              price
            }
          ];
        } else {
          state.selectedBooks = state.selectedBooks.filter(
            selectedBook => selectedBook.bookId !== bookId
          );
        }
      }}
    />
  ));

  return (
    <div>
      <h2>
        Selected books: {state.selectedBooks.length} | 
        Total price of selected books: {
          state.selectedBooks.length
            ? state
                .selectedBooks
                .reduce((book1, book2) => ({price: book1.price + book2.price}))
                .price
                .toFixed(2)
            : 0
        }
      </h2>
      <Link href='/books/create'>
        <a>New book</a>
      </Link>
      <br />
      <br />
      {books}
    </div>
  );
}

export default function () {
  return (
    <ApolloProvider client={client}>
      <Books />
    </ApolloProvider>
  );
};
