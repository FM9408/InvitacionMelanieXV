import { firebaseApp } from '.';
import * as firebaseStorage from 'firebase/storage';

export const storage = firebaseStorage.getStorage(firebaseApp);




const imagesStorage = firebaseStorage.ref(storage, 'images');
const audioStorage = firebaseStorage.ref(storage, 'audio');
const videoStorage = firebaseStorage.ref(storage, 'videos');



export async function getimages() {
    const mela1Ref = firebaseStorage.ref(imagesStorage, 'imageMela!.jpeg');
    const videoRef = firebaseStorage.ref(videoStorage, 'rose_video.mp4');
    const afterTheMasca = firebaseStorage.ref(
        audioStorage,
        'After_the_Masquerade.mp3'
    );
    const corazonDeNinoRef = firebaseStorage.ref(
        audioStorage,
        'corazondeniño.mp3'
    );
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
        const videoURL = await firebaseStorage.getDownloadURL(videoRef);
        const urlMela2 = await firebaseStorage.getDownloadURL(mela2Ref);
        const urlAfterTheMasquerade =
            await firebaseStorage.getDownloadURL(afterTheMasca);
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
        const urlCorazonDeNino =
            await firebaseStorage.getDownloadURL(corazonDeNinoRef);


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
            roseVideo: videoURL,
            corazonDeNino: urlCorazonDeNino,
            afterTheMascarade: urlAfterTheMasquerade,

        };
        return ImagesObject;
    } catch (error) {
        throw new Error(error);
    }
}
