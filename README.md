# Subtraction_API
An API to produce question bank of subtraction questions for young students

## Inputs
- Number of questions
- Number of digits in minuend (first number in subtraction) and number of digits in subtrahend (second number in subtraction)
- A boolean flag which tells each question should have some borrowing or not

## Outputs
- List of questions, with each question containing:
  - Minuend
  - Subtrahend
  - Correct Answer
  - List of 4 possible options

## Algorithm to generate options
The Algorithm makes use of two functions `nearby(diff)` and `totalrandom(diff)`.
`nearby(diff)` generates a list of 4 options which are highly similar to the given input. 
`totalrandom(diff)` generates a list of 4 random options which are in the same digit range as given input.
A detailed understanding of the algorithm can be found in the following document [API Algorithm](https://drive.google.com/file/d/1efPAwNtqPl3aCJ5wxjNNnMvxg-pHYRPi/view?usp=sharing)

## Access and Usage
Please visit at [Subtraction API](https://thawing-atoll-20678.herokuapp.com/posts) and make a POST request with the following example input in JSON format

### Example Input
```
{
    "question": 3,
    "minuend": 4,
    "subtrahend": 3,
    "flag": 1
}
```

### Example Ouput
```
{
    "minuend": [
        5503,
        3547,
        3703
    ],
    "subtrahend": [
        113,
        836,
        551
    ],
    "correct_answer": [
        5390,
        2711,
        3152
    ],
    "option": [
        [
            5390,
            5384,
            5391,
            1752
        ],
        [
            2708,
            2711,
            8874,
            2549
        ],
        [
            8213,
            6279,
            3527,
            3152
        ]
    ]
}
```
