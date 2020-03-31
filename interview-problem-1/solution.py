def get_digits(decimal_number, base):

    if decimal_number < base:
        return [decimal_number]

    digits = []
    base_in_maximum_power = base ** 0

    while True:
        if decimal_number >= base_in_maximum_power:
            base_in_maximum_power *= base
        else:
            base_in_maximum_power = base_in_maximum_power // base
            
            digit = decimal_number // base_in_maximum_power
            digits.append(digit)

            decimal_number -= digit * base_in_maximum_power

            if base_in_maximum_power == 1:
                break

    return digits


def is_palindrome(digits):

    if len(digits) > 1:
        first_half_of_digits = None   # default value
        second_half_of_digits = None  # default value
        if len(digits) % 2 == 0:
            first_half_of_digits = digits[:len(digits) // 2]
            second_half_of_digits = digits[len(digits) // 2:]
        else:
            first_half_of_digits = digits[:(len(digits) - 1) // 2 + 1]
            second_half_of_digits = digits[(len(digits) - 1) // 2:]

        if first_half_of_digits == [*reversed(second_half_of_digits)]:
            return True
        else:
            return False
    else:
        return True


def get_smallest_bases_for_palindromic_numbers(numbers):
    
    for number in range(1, numbers + 1):
        for base in range(2, number + 2):
            digits = get_digits(number, base)
            if is_palindrome(digits):
                yield (number, base)
                break


if __name__ == "__main__":

    for (number, base) in get_smallest_bases_for_palindromic_numbers(1000):
        print(number, base)
