import React from 'react';
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";
import {ApolloProvider, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useMutation} from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: "http://localhost:4567/graphql"
});

function BookEditor() {
  const router = useRouter();
  const {bookId} = router.query;

  const {loading, error, data: queryData} = useQuery(gql`
    query Book($bookId: Int!) {
      book(bookId: $bookId) {
        bookId
        title
        author
        price
      }
    } 
  `, {
    variables: {
      bookId: bookId
    }
  });

  const [editBook, {data: mutationData}] = useMutation(gql`
    mutation EditBook(
      $bookId: Int!
      $title: String!
      $author: String!
      $price: Float!
    ) {
      editBook(
        bookId: $bookId
        title: $title
        author: $author
        price: $price
      ) {
        bookId
      }
    }
  `);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>An error occured.</p>;
  }

  function onSubmit(event) {
    event.preventDefault();

    const {
      title,
      author,
      price
    } = event.target.elements;

    editBook({variables: {
      bookId: bookId,
      title: title.value,
      author: author.value,
      price: price.value
    }});
  }

  return (
    <div>
      <h2>Edit "{queryData.book.title}"</h2>
      <form onSubmit={onSubmit}>
        <div>Title:</div>
        <input type="text" name='title' defaultValue={queryData.book.title} />
        
        <div>Author:</div>
        <input type="text" name='author' defaultValue={queryData.book.author} />
        
        <div>Price:</div>
        <input type="text" name='price' defaultValue={queryData.book.price} />
        
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
      <BookEditor />
    </ApolloProvider>
  );
};
