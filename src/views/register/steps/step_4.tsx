import { PText } from "@/shared/components/p_text"
import { FormikProps } from "formik";
import { RegisterUserFormik, registerUserFormFields } from "../validation_scheme";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";

interface Step4Props {
    formik: FormikProps<RegisterUserFormik>;
    nextStep: () => void;
}
export const Step4 = ({
    formik,
    nextStep
}: Step4Props) => {
    const { data } = trpc.register.useMutation();
    const [selected, setSelected] = useState<'light' | 'darkness'>(formik.getFieldProps(registerUserFormFields.alignment).value);

    useEffect(() => {
        const alignment = formik.getFieldProps(registerUserFormFields.alignment).value;
        setSelected(alignment)
    },[formik.getFieldProps(registerUserFormFields.alignment).value])

    return <div className={`grid items-center justify-between w-screen h-screen grid-cols-2 p-3 bg-primary-400`}>
        <div onClick={() => formik.setFieldValue(registerUserFormFields.alignment, "light")} className={`${selected === 'light' ? 'bg-secondary-400' : 'bg-primary-500'} flex items-center justify-center h-full border-r-2 border-white cursor-pointer hover:bg-opacity-50`}>
            <PText>Light</PText>
        </div>
        <div onClick={() => formik.setFieldValue(registerUserFormFields.alignment, "darkness")} className={`${selected === 'darkness' ? 'bg-secondary-400' : 'bg-primary-500'} flex items-center justify-center h-full cursor-pointer hover:bg-opacity-50`}>
            <PText>Darkness</PText>
        </div>
    </div>
}