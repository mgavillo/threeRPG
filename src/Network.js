
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

import { config } from "../config";


const app = initializeApp(config);
const database = getDatabase(app);

async function getOtherPlayers(postId){
    const starCountRef = ref(database, 'posts/' + postId + '/starCount');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      updateStarCount(postElement, data);
    });
}



function writeUserData(userId) {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }