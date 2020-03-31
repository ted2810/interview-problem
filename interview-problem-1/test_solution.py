import pytest
import solution


def test_get_digits():
    assert solution.get_digits(2, 5) == [2]
    assert solution.get_digits(5, 2) == [1, 0, 1]
    assert solution.get_digits(100, 4) == [1, 2, 1, 0]


def test_is_palindrome():
    assert solution.is_palindrome([2]) is True
    assert solution.is_palindrome([1, 0, 1]) is True
    assert solution.is_palindrome([1, 2, 1, 0]) is False


def test_get_smallest_bases_for_palindromic_numbers():
    assert list(solution.get_smallest_bases_for_palindromic_numbers(10)) == \
           [(1, 2), (2, 3), (3, 2), (4, 3), (5, 2), (6, 5), (7, 2), (8, 3), (9, 2), (10, 3)]
    
