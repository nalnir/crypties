import { FormikProps } from "formik";
import { RegisterUserFormik } from "../validation_scheme";

interface Step3Props {
    formik: FormikProps<RegisterUserFormik>;
    nextStep: () => void;
}

export const Step3 = ({
    formik,
    nextStep
}: Step3Props) => {
    return <div className="w-screen h-screen p-3 bg-primary-400">

    </div>
}