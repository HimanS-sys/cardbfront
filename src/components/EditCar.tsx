import { useState } from "react";
import { Car, CarResponse, CarEntry } from "../Types";
import CarDialogContent from "./CarDialogContent";
import { updateCar } from "../api/carapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ToolTip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
type FormProps = {
    cardata: CarResponse;
}
function EditCar({cardata}: FormProps) {
    const [open, setOpen] = useState(false);
    const [car, setCar] = useState<Car>({
        brand: '',
        model: '',
        color: '',
        registrationNumber: '',
        modelYear: 0,
        price: 0
    });
    const queryClient = useQueryClient();
    const { mutate } = useMutation(updateCar, {
        onSuccess: () => {
            queryClient.invalidateQueries(["cars"]);
        },
        onError: (err) => {
            console.error(err);
        }
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCar({...car, [event.target.name]: event.target.value});
    }
    const handleClickOpen = () => {
        setCar({
            brand: cardata.brand,
            model: cardata.model,
            color: cardata.color,
            registrationNumber: cardata.registrationNumber,
            modelYear: cardata.modelYear,
            price: cardata.price
        });
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleSave = () => {
        const url = cardata._links.self.href;
        const carEntry: CarEntry = {car, url};
        mutate(carEntry);
        setCar({brand: '', model: '', color: '', registrationNumber: '', 
            modelYear: 0, price: 0});
        setOpen(false);
    }

    return (
        <>
            <ToolTip title="Edit Car">
                <IconButton onClick={handleClickOpen}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </ToolTip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Car</DialogTitle>
                <CarDialogContent car={car} handleChange={handleChange}/>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default EditCar;