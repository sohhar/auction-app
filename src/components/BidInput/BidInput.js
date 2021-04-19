import TextField from '@material-ui/core/TextField'
import Button from '../../globalStyles'
import {
    BidInputSection,
    BidInputRow,
    BidInputColumn,
    TextWrapper
} from './BidInput.style';

function BidInput() {

    return (
        <BidInputRow>
            <BidInputColumn>
                <TextField
                    id="outlined-helperText"
                    label="Helper text"
                    defaultValue="Enter bid in Ether"
                    helperText="Enter bid in Ether"
                    variant="outlined"
                />
            </BidInputColumn>
            <BidInputColumn>
                <Button small fontBig primary={'primary'} >
                    Submit Bid
                </Button>
            </BidInputColumn>
        </BidInputRow>
    )
}

export default BidInput