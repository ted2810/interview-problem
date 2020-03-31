import React from 'react';
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from 'next/link';
import {useMutation} from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: "http://localhost:4567/graphql"
});

function BookCreator() {
  const [createBook, {data: mutationData}] = useMutation(gql`
    mutation CreateBook(
      $title: String!
      $author: String!
      $price: Float!
    ) {
      createBook(
        title: $title
        author: $author
        price: $price
      ) {
        bookId
      }
    }
  `);
  
  function onSubmit(event) {
    event.preventDefault();

    const {
      title,
      author,
      price
    } = event.target.elements;

    createBook({variables: {
      title: title.value,
      author: author.value,
      price: price.value
    }});
  }

  return (
    <div>
      <h2>Create a new book</h2>
      <form onSubmit={onSubmit}>
        <div>Title:</div>
        <input type="text" name='title' />
        
        <div>Author:</div>
        <input type="text" name='author' />
        
        <div>Price:</div>
        <input type="text" name='price' />
        
        <br />
        <input type="submit" value="Edit" />
        <Link href='/books'>
          <button>Cancel</button>
        </Link>
        <div>{mutationData ? 'Success.' : ''}</div>
      </form>
    </div>
  );
}

export default function () {
  return (
    <ApolloProvider client={client}>
      <BookCreator />
    </ApolloProvider>
  );
};
