# CONNECT 4

_CONNECT 4_ is a website hosting a game called [Connect Four](https://en.wikipedia.org/wiki/Connect_Four)*. The site will be targeted towards people who want to play a quick and fun game regardless of their age. The site can be used for adults to have a short getaway and for children to learn the rules. The main goal of this project is to implement my JavaScript knowledge in a real-world context.

*Connect Four is a classic two-player strategy game, in which players take turns to drop their coloured disc into a 6-row by 7-column grid until one of the players forms a line of 4 discs horizontally, vertically or diagonally.

![Responsive Design](documentation/responsive.png)

### View the live project [here](https://sejungkwak.github.io/connect-4/)

<br>

# Table of Contents

[User Experience (UX)](#user-experience-ux)
  - [User Stories](#user-stories)
  - [Design](#design)
  - [Wireframes / Mockups](#wireframes--mockups)
  - [Flowchart](#flowchart)

[Features](#features)
  - [Implemented Features](#implemented-features)
  - [Features Left to Implement](#features-left-to-implement)

<br>

# User Experience (UX)

## User Stories

- As a First Time Visitor,
  - I want to know how to play the game, so that I can enjoy it fully.
  - I want to know clearly when it is my turn, so that I don't delay the game.
  - I want to see the game board screen again when the game is over, so that I can figure out why I've won or lost.

<br>

- As a Returning Visitor,
  - I want to be able to play the game on my phone, so that I can play it on a break at work.
  - I want to play the game with my kids, so that we can have fun together.
  - I want to play the game against a computer, so that I can play practice games.

<br>

- As a Frequent User,
  - I want to be able to check my rank, so that I can see how good I am.
  - I want to be able to contact the developer, so that I can suggest my ideas.
  - I want to play the game against other players online, so that I can experience different play styles.

<br>

## Design

- Colour Scheme

  The best-known version of the physical game set which has been produced by [Hasbro](https://shop.hasbro.com/en-us/product/connect-4-game:80FB5BCA-5056-9047-F5F4-5EB5DF88DAF4) uses 3 colours: blue for the grid, yellow and red for discs. I have followed this colour convention with my own interpretation using [Canva](https://www.canva.com/) > Create a design > Logo > Styles and the colour picker.

  ![Colour Scheme](documentation/colour-scheme.png)

- Typography

  - Headings: [Fredoka One](https://fonts.google.com/specimen/Fredoka+One) is used with Cursive as the fallback font in case the font isn't being imported into the site correctly. I have chosen Fredoka One for its big, bold and rounded shape which gives a soft feeling and adds a little fun to headings.

  - Paragraph: [Poppins](https://fonts.google.com/specimen/Poppins) is used with Sans Serif as the fallback font. I have chosen Poppins for readability and its sharp corners as opposed to Fredoka One.

- Logo

  The logo has the website name _CONNECT 4_ with the number 4 in a yellow colour on a red background circle which are the main colours of the game.

  ![Logo](assets/images/logo.png)

- Favicon

  The number 4 in a yellow colour on a red background circle in the same style as the logo.

  ![Favicon](assets/images/favicon/favicon.ico)

<br>

## Wireframes / Mockups

- _CONNECT 4_ is designed with the following goals in mind:
	- A user can navigate to other pages while playing a game, and resume the game without having to restart.
	- A user can start a game with as few clicks as possible.
- To achieve these goals:
	- It is written in a single HTML file.
	- One page is shown at a time. Others are not displayed.
	- The __New game__ page is on the landing screen.
- I created wireframes and mockups for mobile and desktop.
- [View Wireframes and Mockups](documentation/DESIGN.md)

<br>

## Flowchart

I created a flowchart to visualise the process before writing JavaScript code.

![Flowchart](documentation/flowchart.png)

[Back To **Table of Contents**](#table-of-contents)

<br>

# Features

## Implemented Features
The site features a fully responsive design and contains 4 game related pages(__New game__, __Play__, __Help__, __Leaderboard__), 3 supporting pages(__Contact__, __Success__, __Fail__) and a 404 page. The header and footer are identical for all pages except the 404 page.

- Header

  ![Header](documentation/features/header.png)

  - The header is fixed to the top of the screen even when the user is scrolling down the page to allow easier navigation.
  - The logo is linked to the __New Game__ page and each menu item(New game, Play, Help, Leaderboard) is linked to each page respectively to allow easier navigation.
  - The navigation menu item for the current page is highlighted and underlined as the user browses the site for ease of use.
  - The navigation menu collapses on small devices less than 600px width to optimise the menu for smaller screen sizes.

    ![Header on mobile](documentation/features/header-mobile.png)

- Footer

  ![Footer](documentation/features/footer.png)

  - The footer includes the two following links

    - A link to the project's [_GitHub_ repository](https://github.com/sejungkwak/connect-4) to allow the users to learn more about this project.
    - A link to the __Contact__ page to allow the users to send a message to me directly from the site.
  
  - The external link opens in a new tab to allow the user to return to _Connect 4_ more easily.

- __New Game__ page

  ![New Game](documentation/features/new-game.png)

  - Upon landing _Connect 4_, this page is displayed for quick access to the game.
  - The form allows users to change the game settings.
  - Feedback is provided when the user changes to an invalid option. Both players must have a unique colour/name and at least one human player is required.

    | Invalid option | 2 computer players | Same colour | Same name |
    | :-------------: | :-------------: | :---------: | :-----------: |
    |  | ![Invalid player type alert](documentation/features/new-game-alert-type.png) | ![Invalid disc colour alert](documentation/features/new-game-alert-colour.png) | ![Invalid display name alert](documentation/features/new-game-alert-name.png) |

  - This page provides two buttons that open the __Play__ page.

    - __START__: The user can start a new game.
    - __CLOSE__: The user can resume the game they are playing.

- __Play__ page

  ![Play page](documentation/features/play.png)

  - This page displays the current player in the heading, allowing the user to make a move promptly.
  - There are sound effects when a disc is being placed and a game ends for a more enjoyable experience.
  - The user can turn on and off the sound as they prefer.
  - The first character of the disc colour is inside all placed discs for the colour blind users.
  - The game board is being adjusted to the screen size.
  - The user can play the game with arrow keys to allow the user to control depending on their preference.
  - If the user hasn't started a game and opens this page, the message displays instead of the game board to let the user know how to start a game.

    ![Play page without a game](documentation/features/play-nogame.png)

  - The display mode alert is displayed when the whole game board is not shown on the screen. However, if the player still wants to play in landscape mode, they can press the __OK__ button and continue to play.

    ![Play page display mode alert](documentation/features/play-alert-landscape.png)

- __Help__ page

  ![Help page](documentation/features/help.png)

  - This page contains 5 articles about the game objective, how to play, keyboard controls, points system and leaderboard to help users understand the game and the site specific rules.
  - Less than 1024px width devices show each article in a single column to optimise the layout.

- __Leaderboard__ page

  ![Leaderboard page](documentation/features/leaderboard.png)

  - This page displays the top 5 players who gained the highest points with the number of games they played and the winning rate to allow them to see their performance.
  - The user can delete data from local storage with the convenient __Delete data__ button.
  - The message is shown when there is no data to display or unable to get the data from local storage.

    ![Leaderboard page without data](documentation/features/leaderboard-nodata.png)

- __Contact__ page

  ![Contact page](documentation/features/contact.png)

  - This page contains brief information about me and the contact form.

    - Information about me

      - This part lets the users know about me to make them more comfortable and more likely to provide their feedback.

    - Contact form

      - This form allows the user to send their message without having to open their email client.
      - All the fields are required and give feedback if empty(including whitespace) or invalid.
      - Upon clicking the __Send__ button, the user is redirected to either the __Success__ page or the __Fail__ page.
      - Less than 1024px width devices show each article in a single column to optimise the layout.

- __Success__ page

  ![Success page](documentation/features/contact-success.png)

  - This page gives feedback to the user when their message has been sent successfully.
  - It includes a button to the Home page for quick access.

- __Fail__ page

  ![Fail page](documentation/features/contact-fail.png)

  - This page gives feedback to the user when there was a problem delivering their message.
  - It includes a button to go back to the __Contact__ page.

- 404 page

  ![404 page](documentation/features/404.png)

  - This page gives feedback to the user when they try to access nonexistent pages on the site.
  - The blinking animation is disabled for any user with reduced motion enabled in their preferences on their device.
  - It includes a button to the Home page for quick access.
  - [View 404 page](https://sejungkwak.github.io/connect-4/404.html)

<br>

## Features Left to Implement

- Smarter AI Player

  The computer player picks a cell to place a disc randomly, so a game against the computer is too easy. I would like to build a smarter AI that prevents the player from winning so easily for a more enjoyable game.
  There is Pascal Pons’s [tutorial blog](http://blog.gamesolver.org/) about the connect 4 solver using alpha-beta pruning algorithm. Unfortunately, I was not able to fully understand the algorithm in depth to implement it into this project.

- Online live game platform

  Users can currently play on one device and cannot play against another player remotely. I would like to implement an online live game platform when I am confident in building a back-end.

- Database

  When an online live game platform is available, it is more appropriate to use an online database to show all the players from the site in a single leaderboard.

[Back To **Table of Contents**](#table-of-contents)

<br>
