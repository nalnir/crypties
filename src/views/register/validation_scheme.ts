import * as Yup from 'yup';

export interface RegisterUserFormik {
    descriptors: string[]

    // STEP 4
    alignment: "light" | "darkness",
}

export const registerUserFormFields = {

    // STEP 3
    "descriptors": "descriptors",

    // STEP 4
    "alignment": "alignment",
}

export const registerUserValidationSchema = Yup.object({

});