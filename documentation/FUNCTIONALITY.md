# Table of Contents

[Header](#header)

[Footer](#footer)

[__New Game__ page](#new-game-page)

[__Play__ page](#play-page)

[__Leaderboard__ page](#leaderboard-page)

[__Contact__ page](#contact-page)

[__Success__ page](#success-page)

[__Fail__ page](#fail-page)

[404 page](#404-page)

Note: The __Help__ page contains plain text. Please refer to the test results of the header and footer section for the links on the page.

Please refer to [this spreadsheet](https://docs.google.com/spreadsheets/d/1E7wnBZnPF_TpL5YnwWEgTs9hyUr4EUc73P5JGXWsCW4/edit?usp=sharing) for more details.

<br>

## Header

| Device | Input | Expected result | Actual result | Test result |
| :--: | :--: | :--: | :--: | :--: |
| Mobile | Press ≡ | Open the navigation menu | Open the navigation menu | Pass |
| Mobile | Press ⨉ | Close the navigation menu | Close the navigation menu | Pass |
| All | Click / Press the logo | Go to the __New Game__ page | Go to the __New Game__ page | Pass |
| All | Click / Press __New Game__ | Go to the __New Game__ page | Go to the __New Game__ page | Pass |
| All | Click / Press __Play__ | Go to the __Play__ page | Go to the __Play__ page | Pass |
| All | Click / Press __Help__ | Go to the __Help__ page | Go to the __Help__ page | Pass |
| All | Click / Press __Leaderboard__ | Go to the __Leaderboard__ page | Go to the __Leaderboard__ page | Pass |

[Back To __Table of Contents__](#table-of-contents)

<br>

## Footer

| Device | Input | Expected result | Actual result | Test result |
| :--: | :--: | :--: | :--: | :--: |
| All | Click / Press the _GitHub_ icon | Open the _GitHub_ repo in a new tab | Open the _GitHub_ repo in a new tab | Pass |
| All | Click / Press the envelope icon | Go to the __Contact__ page | Go to the __Contact__ page | Pass |

[Back To __Table of Contents__](#table-of-contents)

<br>

## New Game page

| Device | Input | Expected result | Actual result | Test result |
| :--: | :--: | :--: | :--: | :--: |
| All | Set both human / computer sliders to computer | Switch the opponent's slider to human | Switch the opponent's slider to human | Pass |
| All | Set both colour sliders to the same colour | Switch the opponent's slider to the other colour | Switch the opponent's slider to the other colour | Pass |
| All | Click / Press __START__ with the same name for both players | Display the name alert* | Display the name alert* | Pass |
| All | Click / Press __START__ with the valid settings | Go to the __Play__ page | Go to the __Play__ page | Pass |
| All | Click / Press __CLOSE__ | Go to the __Play__ page | Go to the __Play__ page | Pass |

*message: Please make sure each player's name is unique.

[Back To __Table of Contents__](#table-of-contents)

<br>

## Play page

| Device | Input | Expected result | Actual result | Test result |
| :--: | :--: | :--: | :--: | :--: |
| All | Click / Press the board on an available column | Place a disc in the target column and change the display name to the other player's name | Place a disc in the target column and change the display name to the other player's name | Pass |
| All | Click / Press the board on a full column | No change | No change | Pass |
| All | Click / Press the board on Computer's turn | No change | No change | Pass |
| All | A human player forms a line of 4 discs | Show the result in popup | Show the result in popup | Pass |
| All | The computer forms a line of 4 discs | Show the result in popup | Show the result in popup | Pass |
| All | Click / Press the __Play again__ button | Close the popup, clear the game board and display the player's name | Close the popup, clear the game board and display the player's name | Pass |
| All | Click / Press the mute icon | Turn on the sound | Turn on the sound | Pass |
| All | Click / Press the speaker icon | Turn off the sound | Turn off the sound | Pass |
| All | Open this page without clicking / pressing __Start__ on the __New Game__ page | Display the message* | Display the message* | Pass |
| All | Click / Press __Go to New Game__ below the message* | Go to the __New Game__ page | Go to the __New Game__ page | Pass |
| Mobile / Tablet | Rotate the screen to landscape mode | Display the alert** | Display the alert** | Pass |
| Mobile / Tablet | Press __OK__ on the display mode alert | Close the alert | Close the alert | Pass |
| Desktop | Hover the game board | Display a  column indicator disc*** on top of the board | Display a  column indicator disc on top of the board | Pass |
| Desktop | Press the left arrow key | Display a  column indicator disc on top of the 7th column | Display a  column indicator disc on top of the 7th column | Pass |
| Desktop | Press the right arrow key | Display a  column indicator disc on top of the 1st column | Display a  column indicator disc on top of the 1st column | Pass |
| Desktop | Press the down arrow key with a  column indicator disc on top of an empty column | Place the disc | Place the disc | Pass |
| Desktop | Press the down arrow key with a  column indicator disc on top of a full column | No change | No change | Pass |
| Desktop | Press the down arrow key without a  column indicator disc | No change | No change | Pass |

*Message: Please start a game by opening the NEW GAME page and clicking the START button.

**Message: The whole board is not shown on the screen in landscape mode. Please use portrait mode for the best experience.

***Column indicator disc: A disc that is displayed on top of the first row as the user moves the mouse on the board.

[Back To __Table of Contents__](#table-of-contents)

<br>

## Leaderboard page

| Device | Input | Expected result | Actual result | Test result |
| :--: | :--: | :--: | :--: | :--: |
| All | Click / Press the __Delete Data__ button | Display the alert* | Display the alert* | Pass |
| All | Click / Press __Cancel__ on the alert | Close the alert | Close the alert | Pass |
| All | Click / Press __OK__ on the alert | Remove the leaderboard table and display the message** | Remove the leaderboard table and display the message** | Pass |

*Message: Are you sure you want to delete your save data? It cannot be restored once it's deleted.

**Message: Unable to find save data.

[Back To __Table of Contents__](#table-of-contents)

<br>

## Contact page

Click / Press the __SEND__ button with/without inputting anything in the name, email and message fields

| Device | Input | Expected result | Actual result | Test result |
| :--: | :--: | :--: | :--: | :--: |
| All | Without anything | Show an error message above / below the name field | Show an error message above / below the name field | Pass |
| All | with name, without email and message | Show an error message above / below the email field | Show an error message above / below the email field | Pass |
| All | with name and email, without message | Show an error message above / below the message field | Show an error message above / below the message field | Pass |
| All | only whitespace in the name field | Show the custom error message above / below the name field | Show the custom error message above / below the name field | Pass |
| All | email without '@' | Show an error message above / below the email field | Show an error message above / below the email field | Pass |
| All | only whitespace in the message field | Show the custom error message above / below the message field | Show the custom error message above / below the message field | Pass |
| All | with valid input values in all fields | Change the button text to "SEND..." and go to the __Success__ or __Fail__ page | Change the button text to "SEND..." and go to the __Success__ or __Fail__ page | Pass |

[Back To __Table of Contents__](#table-of-contents)

<br>

## Success page

| Device | Input | Expected result | Actual result | Test result |
| :--: | :--: | :--: | :--: | :--: |
| All | Click / Press the __GO HOME__ button | Go to the __New Game__ page | Go to the __New Game__ page | Pass |

[Back To __Table of Contents__](#table-of-contents)

<br>

## Fail page

| Device | Input | Expected result | Actual result | Test result |
| :--: | :--: | :--: | :--: | :--: |
| All | Click / Press the __GO BACK__ button | Go to the __Contact__ page | Go to the __Contact__ page | Pass |

[Back To __Table of Contents__](#table-of-contents)

<br>

## 404 page

| Device | Input | Expected result | Actual result | Test result |
| :--: | :--: | :--: | :--: | :--: |
| All | Input invalid URL at https://sejungkwak.github.io/connect-4/ | Go to the 404 page | Go to the 404 page | Pass |
| All | Click / Press the __GO HOME__ button | Go to the __New Game__ page | Go to the __New Game__ page | Pass |

[Back To __Table of Contents__](#table-of-contents)
