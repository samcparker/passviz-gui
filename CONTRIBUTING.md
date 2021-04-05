
# Contributing

Thank you for taking the time to read the CONTRIBUTING file. Password Universe is always looking for contributors to keep the project alive and improve the quality of code and its functionality.


## Project Description

I will give a brief description of each file here. Further details are given within the files themselves.
- App.vue
    - Holds the App of the project, being the UniverseContainer, GenerateLoad, Settings and Tabs.
- passworduniversegenerator.ts
    - Code to generate a universe. It calls the worker.js file if generating from the client side.
- worker.js
    - Parallel worker to generate the universe aysnchronously.
- storage.ts
    - Access the Electron storage or localStorage in browser.
- components/
    - GenerateLoad.vue
        - Buttons and dialogs to generate and load the universe.
    - Settings.vue
        - Settings button and dialog to handle settings.
    - Tabs.vue
        - Holds all the tabs.
    - Tab.vue
        - Tab pertaining to the Universe object. Allows for deletion, cloning, saving and hiding/showing. It also includes information regarding the state of the universe (generating, generated, errored).
    - UniverseContainer.vue
        - Holds universe components.
    - Universe.vue
        - Universe object to display the universe. Contains controls like graphical controls and search queries.

## How To Contribute

### Report Bugs

If you experience any issues, please report them as a GitHub issues.

### Suggest Improvements

If you want to suggest an improvement, suggest them as a GitHub issue.

### Write Code

You can also write code to help improve the state of Password Universe.
 
It will require some knowledge of Vue.js, Electron, or d3.js.