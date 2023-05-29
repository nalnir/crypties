import { FormikProps } from "formik";
import { RegisterUserFormik } from "../validation_scheme";

interface Step2Props {
    formik: FormikProps<RegisterUserFormik>;
    nextStep: () => void;
}

export const Step2 = ({
    formik,
    nextStep
}: Step2Props) => {
    return <div className="w-screen h-screen p-3 bg-primary-400">

    </div>
}