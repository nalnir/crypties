import * as Yup from 'yup';

export interface RegisterUserFormik {
    // STEP 1
    race: string,

    // STEP 2
    heroClass: string,

    // STEP 3
    look: string,
    skin: string,
    gender: "male" | "female",
    profilePicture: {
        url: string,
        blob: Blob | null
    }

    // STEP 4
    alignment: "light" | "darkness",
}

export const registerUserFormFields = {
    // STEP 1
    "race": "race",

    // STEP 2
    "heroClass": "heroClass",

    // STEP 3
    "look": "look",
    "skin": "skin",
    "gender": "gender",
    "profilePicture": "profilePicture",

    // STEP 4
    "alignment": "alignment",
}

export const registerUserValidationSchema = Yup.object({

});