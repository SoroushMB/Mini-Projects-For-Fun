import random

computer_choice = random.choice(['scissors', 'rock', 'paper'])
user_choice = input('Do u want - rock, paper, or scissors?\n')

if computer_choice == user_choice:
    print('Tie')
elif user_choice == 'rock' and computer_choice == 'scissors':
    print('WIN, the computer had' + computer_choice)
elif user_choice == 'paper' and computer_choice == 'rock':
    print('WIN, the computer had' + computer_choice)
elif user_choice == 'scissors' and computer_choice == 'paper':
    print('WIN, the computer had' + computer_choice)
else:
    print('You lose :( Computer wins :D The computer had' + computer_choice)