Inspiration
Individuals with mental health struggles often find it overwhelming to complete seemingly simple everyday tasks such as cleaning your room. When motivation is low, chores like these tend to become less of a priority. We wanted to design an app that turns these tasks into something rewarding, fun, and achievable. We aim to turn everyday cleaning into a gamified experience in order to provide motivation and reinforcement, one small win at a time.

What it does
Room Bloom provides users with motivation through visual progress and positive reinforcement. The app allows users to upload a picture of their space before and after cleaning it up. The app then uses Google Cloud Vision to asses the difference in cleanliness of the space and awards points to the user as well as a positive affirmation. Points can be used to decorate a virtual room, by adding features plants, furniture, and other visual rewards that grow as they complete more tasks.

How we built it
We used React Native with Expo to create a mobile app with a clean, simple and easy to use interface. The images that the users upload were encoded in Base64 and sent to used Google Cloud Vision's API. We used its object localization feature to detect the number of objects in the before and after pictures that the user uploaded. We used the change in number of detected objects to calculate a cleanliness score and award points. If the number of points was past a certain threshold the user was allowed to add a decoration to their room and was also presented with a positive affirmation.
