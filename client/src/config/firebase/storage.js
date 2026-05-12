import { firebaseApp } from '.';
import * as firebaseStorage from 'firebase/storage';

export const storage = firebaseStorage.getStorage(firebaseApp);

if (import.meta.env.MODE === 'development') {
    firebaseStorage.connectStorageEmulator(storage, 'localhost', 9199);
}

const imagesStorage = firebaseStorage.ref(storage, 'images');
const audioStorage = firebaseStorage.ref(storage, 'audio');

export async function getAudio () {
    const afterRef = firebaseStorage.ref(
        audioStorage,
        'After_the_Masquerade.mp3'
    );
    try {
        const afterTheMasqueradeURL =
            await firebaseStorage.getDownloadURL(afterRef);
            
            const audioObjects = {
                afterTheMasquerade: afterTheMasqueradeURL,
            };
       return audioObjects;
    } catch (error) {
       throw new Error(error);
   
    }
    
 }

export async function getimages() {
    const mela1Ref = firebaseStorage.ref(imagesStorage, 'imageMela!.jpeg');
    const dashboardBackgroundRef = firebaseStorage.ref(
        imagesStorage,
        'dashboardBackground.png'
    );
    const mela2Ref = firebaseStorage.ref(imagesStorage, 'imageMela2.jpeg');
    const melanieWRose = firebaseStorage.ref(imagesStorage, 'melanieWrose.png');
    const inMemoriamRef = firebaseStorage.ref(
        imagesStorage,
        'InMemoriamBack.png'
    );
    const gardenOfRosesRef = firebaseStorage.ref(
        imagesStorage,
        'gardenofRoses.png'
    );
    const backgroundRef = firebaseStorage.ref(imagesStorage, 'background.png');
    const rosesBackref = firebaseStorage.ref(imagesStorage, 'roseBack.png');
    const roseBack2Ref = firebaseStorage.ref(imagesStorage, 'roseBack2.png');
    const notFoundRef = firebaseStorage.ref(imagesStorage, '404.png');

    try {
        const urlMela1 = await firebaseStorage.getDownloadURL(mela1Ref);
        const urlMela2 = await firebaseStorage.getDownloadURL(mela2Ref);
        const urlMelanieWRose =
            await firebaseStorage.getDownloadURL(melanieWRose);
      
        const gardenOfRosesURL =
            await firebaseStorage.getDownloadURL(gardenOfRosesRef);
        const dashboardBackgroundURL = await firebaseStorage.getDownloadURL(
            dashboardBackgroundRef
        );
        const backgroundURL =
            await firebaseStorage.getDownloadURL(backgroundRef);
        const inMemoriamURL =
            await firebaseStorage.getDownloadURL(inMemoriamRef);
        const roseBack2URL = await firebaseStorage.getDownloadURL(roseBack2Ref);
        const notFoundURL = await firebaseStorage.getDownloadURL(notFoundRef);
        const roseBackURL = await firebaseStorage.getDownloadURL(rosesBackref);

        const ImagesObject = {
            urlMela1: urlMela1,
            urlMela2: urlMela2,
            urlMelanieWRose: urlMelanieWRose,
            
            gardenOfRoses: gardenOfRosesURL,
            inMemoriam: inMemoriamURL,
            roseBack1: roseBackURL,
            roseBack2: roseBack2URL,
            notFound: notFoundURL,
            background: backgroundURL,
            dashboardBackground: dashboardBackgroundURL,
        };
        return ImagesObject;
    } catch (error) {
        throw new Error(error);
    }
}
