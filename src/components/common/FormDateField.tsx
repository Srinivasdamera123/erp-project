
import { Select, MenuItem } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



function FormDateField() {
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>edit purchase</h1>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
                <Select value="" displayEmpty style={{ minWidth: '250px', height: '57px' }}>
                    <MenuItem value="" disabled>Billing Project*</MenuItem>
                    <MenuItem value={1}>project 1</MenuItem>
                    <MenuItem value={2}>project 1</MenuItem>
                    <MenuItem value={3}>project 1</MenuItem>
                    <MenuItem value={4}>project 1</MenuItem>

                </Select>
                <Select value="" displayEmpty style={{ minWidth: '250px', height: '57px' }}>
                    <MenuItem value="" disabled>Deliveryy project*</MenuItem>
                    <MenuItem value={1}>project 1</MenuItem>
                    <MenuItem value={2}>project 1</MenuItem>
                    <MenuItem value={3}>project 1</MenuItem>
                    <MenuItem value={4}>project 1</MenuItem>

                </Select>
                <Select value="" displayEmpty style={{ minWidth: '250px', height: '57px' }}>
                    <MenuItem value="" disabled>vendor*</MenuItem>
                    <MenuItem value={1}>project 1</MenuItem>
                    <MenuItem value={2}>project 1</MenuItem>
                    <MenuItem value={3}>project 1</MenuItem>
                    <MenuItem value={4}>project 1</MenuItem>

                </Select>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DatePicker />
                </LocalizationProvider>

            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px", marginRight: "340px" }}>
                <TextField id="outlined-basic" label="invoice number" variant="outlined" style={{ minWidth: '250px', height: '57px' }} />
                <TextField id="outlined-basic" label="D.C Number" variant="outlined" style={{ minWidth: '250px', height: '57px' }} />
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DatePicker />
                </LocalizationProvider>


            </div>
            <h2 style={{ textAlign: "center", marginTop: "20px" }}>items</h2>
            <Card>
                <CardContent style={{ display: "flex", justifyContent: "space-evenly", marginTop: "20px" }}>
                    <Typography variant='h6'>
                        Description
                    </Typography>
                    <Typography variant='h6'>
                        material
                    </Typography>
                    <Typography variant='h6'>
                        Type
                    </Typography>
                    <Typography variant='h6'>
                        UOM
                    </Typography>
                    <Typography variant='h6'>
                        Quantity
                    </Typography>
                    <Typography variant='h6'>
                        price
                    </Typography>
                    <Typography variant='h5'>
                        Total price
                    </Typography>

                </CardContent>
            </Card>
            <div>
                <Card style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <CardContent>
                        <TextField id="outlined-basic" label="invoice number" variant="outlined" style={{ minWidth: '100px', height: '57px', marginLeft: "30px" }} />
                    </CardContent>
                    <CardContent>
                        <Select value="" displayEmpty style={{ minWidth: '120px', height: '57px' }}>
                            <MenuItem value="" disabled>material*</MenuItem>
                            <MenuItem value={1}>project 1</MenuItem>
                            <MenuItem value={2}>project 1</MenuItem>
                            <MenuItem value={3}>project 1</MenuItem>
                            <MenuItem value={4}>project 1</MenuItem>

                        </Select>
                    </CardContent>
                    <CardContent>
                        <Select value="" displayEmpty style={{ minWidth: '100px', height: '57px' }}>
                            <MenuItem value="" disabled>Type*</MenuItem>
                            <MenuItem value={1}>project 1</MenuItem>
                            <MenuItem value={2}>project 1</MenuItem>
                            <MenuItem value={3}>project 1</MenuItem>
                            <MenuItem value={4}>project 1</MenuItem>

                        </Select>
                    </CardContent>
                    <CardContent>
                        <Select value="" displayEmpty style={{ minWidth: '80px', height: '57px' }}>
                            <MenuItem value="" disabled>UOM*</MenuItem>
                            <MenuItem value={1}>project 1</MenuItem>
                            <MenuItem value={2}>project 1</MenuItem>
                            <MenuItem value={3}>project 1</MenuItem>
                            <MenuItem value={4}>project 1</MenuItem>

                        </Select>
                    </CardContent>
                    <CardContent>
                        <TextField style={{ width: "100px" }}
                            id="outlined-number"
                            label="Quantity"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </CardContent>
                    <CardContent>
                        <TextField style={{ width: "45px" }}
                            id="outlined-number"
                            label="price*"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </CardContent>
                    <CardContent>
                        <TextField id="standard-basic" variant="standard" style={{ width: "80px" }} />
                    </CardContent>
                    <CardContent>
                        <DeleteIcon />
                    </CardContent>
                </Card>
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <CardContent>
                                <AddCircleOutlineIcon style={{ margin: "100px", marginTop: "200px", backgroundColor: "cyan", color: "black" }} />
                            </CardContent>
                        </div>
                        <div style={{ marginRight: "80px" }}>
                            <div>
                                <CardContent>
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <Typography style={{ marginTop: '38px', marginRight: '10px' }} >Subtotal</Typography>
                                        <TextField id="standard-basic" label="0" variant="standard" />
                                    </div>
                                </CardContent>
                            </div>
                            <div>
                                <CardContent>
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <Typography style={{ marginTop: '38px', marginRight: '10px' }}  >Tax</Typography>
                                        <TextField style={{ width: "200px" }}

                                            id="outlined-number"
                                            label="price*"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </div>
                            <div >
                                <CardContent >
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <Typography style={{ marginTop: '38px', marginRight: '10px' }}> Total</Typography>
                                        <TextField id="standard-basic" label="0" variant="standard" />
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <h4 style={{ marginLeft: "720px", marginTop: "25px" }}>
                Attachments
            </h4>
            <div style={{alignItems:'center' ,textAlign:'center'}}>
            <Button variant='outlined' >Add + </Button>

            </div>
            <div style={{alignItems:'center' ,textAlign:'center',marginTop: "25px"}}>
            <Button variant='outlined' >Submit </Button>

            </div>
            
        </div>
    )
}

export default FormDateField