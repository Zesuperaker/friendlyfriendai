Welcome to Friendly Friend AI. 

Friendly Friend is your private AI friend. This uses google's gemini nano prompt AI, this is a fully client side AI so all your conversations stay on your device and are never sent to anyone.
The AI being client side also means it is completely free. 

To use Friendly Friend AI follow these steps
1. Open a new tab and go to: chrome://flags
2. Set "Enables optimization guide on device" to "Enabled BypassPerfRequirement"
3. Set "Prompt API for Gemini Nano" to "Enabled"
4. Then relaunch chrome
5. Then go to the developer console and download the model with this script:
``const session = await LanguageModel.create({
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  },
});``
6. You can then visit https://friendlyfriendai.com to chat with Friendly Friend AI, or you can clone this repo to run the Friendly Friend code locally.

If you enjoy Friendly Friend AI and want to help improve it we appreciate PRs :)
Friendly Friend AI is realised under an MIT licence so if you have any creative ideas feel free to make your own variation of Friendly Friend.





