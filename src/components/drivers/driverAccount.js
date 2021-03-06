import React, {useState, useEffect} from 'react';
import UpdateDriverForm from './updateDriverForm';
import {useDispatch, useSelector} from 'react-redux';
import {axiosWithAuth} from '../axiosWithAuth';
import {deleteDriver} from '../../actions/actions';
import {decode} from '../decode';
import styled from 'styled-components';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
    START_REQUEST,
    GET_DRIVER_SUCCESS,
    GET_DRIVER_FAIL
} from '../../actions/types';

const OuterDiv = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #E6E8e5;
    width: 100%;
    border-radius: 5px;
    max-width: 400px;
    padding: 4rem 3%;
    box-shadow: 10px 10px 10px darkgreen;
    margin: 3rem 0;
`

const DriverAccount = ({history}) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [modal, setModal] = useState(false);
    const reload = useSelector(state => state.reload);

    const toggle = () => setModal(!modal);

    const deleteAction = () => {
        dispatch(deleteDriver(decode(localStorage.getItem('bfl-token')).subject), history);
        setModal(!modal);
        history.push('/');
    }

    useEffect(() => {
        dispatch({type: START_REQUEST});
        axiosWithAuth()
        .get(`/drivers/${decode(localStorage.getItem('bfl-token')).subject}`)
        .then(res => {
            console.log(res.data);
            dispatch({type: GET_DRIVER_SUCCESS});
            setUser(res.data);
        })
        .catch(err => {
            console.log(err);
            dispatch({type: GET_DRIVER_FAIL, payload: err.response.data.message && err.response.data.message});
        })
    },[reload]);

    return (
        <OuterDiv>
                {user && <UpdateDriverForm driver={user}/>}
                <div>
                    <Button className='mButton' color="danger" onClick={toggle}>Delete Account</Button>
                    <Modal className='mStyles' isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>Delete Account</ModalHeader>
                        <ModalBody>Are you sure you want to delete your account?</ModalBody>
                        <ModalFooter>
                        <Button className='mButton' color="danger" onClick={deleteAction}>Yes I am sure</Button>{' '}
                        <Button className='mButton' color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
        </OuterDiv>
    );
}

export default DriverAccount;