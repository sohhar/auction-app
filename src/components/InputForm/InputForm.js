import { useForm, Controller } from 'react-hook-form'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { Button } from '../../globalStyles'
import {
    InputContainer,
    useStyles
} from './InputForm.style'

export default function InputForm(props) {

    const { control, handleSubmit } = useForm()
    const classes = useStyles();
    console.log(`in form seller ${props.seller}`)

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <InputContainer>
                    <form onSubmit={ handleSubmit(props.addAuction) } >
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                            <Controller
                                name="seller"
                                as={
                                    <TextField
                                        id="seller"
                                        label="Seller"
                                        disabled
                                        variant="outlined" />
                                }
                                control={control}
                                defaultValue={props.seller}
                            />
                        </FormControl>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                            <Controller
                                name="title"
                                as={
                                    <TextField
                                        id="title"
                                        label="Auction Title"
                                        variant="outlined" />
                                }
                                control={control}
                                defaultValue=""
                            />
                        </FormControl>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                            <Controller
                                name="image"
                                as={
                                    <TextField
                                        id="image"
                                        label="Image File"
                                        variant="outlined" />
                                }
                                control={control}
                                defaultValue="images/"
                            />
                        </FormControl>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                            <Controller
                                name="description"
                                as={
                                    <TextField
                                        id="description"
                                        multiline
                                        rows={4}
                                        label="Description"
                                        helperText=""
                                        variant="outlined" />
                                }
                                control={control}
                                defaultValue=""
                            />
                        </FormControl>
                        <FormControl className={classes.margin} variant="outlined">
                            <Controller
                                name="startbid"
                                as={
                                    <TextField
                                        id="startbid"
                                        label="Starting Bid"
                                        helperText="in (Eth)"
                                        variant="outlined" />
                                }
                                control={control}
                                defaultValue=""
                            />
                        </FormControl>
                        <FormControl className={classes.margin} variant="outlined">
                            <Controller
                                name="duration"
                                as={
                                    <TextField
                                        id="duration"
                                        label="Duration"
                                        helperText="Duration (min)"
                                        variant="outlined" />
                                }
                                control={control}
                                defaultValue="60"
                            />
                        </FormControl>
                        <Button Small fontBig
                            id="submitButton"
                            type="submit">
                            Add Auction
                        </Button>
                    </form>
                </InputContainer>
            </Paper>
        </div>
    )
}
