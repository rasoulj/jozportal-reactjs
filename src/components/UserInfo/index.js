import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar'
import {useDispatch, useSelector} from 'react-redux'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {userSignOut} from 'actions/Auth';
import IntlMessages from 'util/IntlMessages';
import {Roles} from "../../models/User";

const UserInfo = () => {

    const dispatch = useDispatch();

    const [anchorE1, setAnchorE1] = useState(null);
    const [open, setOpen] = useState(false);

    const {user, branch} = useSelector(({pax}) => pax);
    const {displayName, role} = user || {displayName: "(Unknown)", role: Roles.NONE};
    const {displayName: branchName} = branch || {};

    const handleClick = event => {
        setOpen(true);
        setAnchorE1(event.currentTarget);
    };

    const handleRequestClose = () => {
        setOpen(false);
    };

    return (
        <div className="user-profile d-flex flex-row align-items-center">
            <Avatar
                alt='AR'
                // src={"https://via.placeholder.com/150x150"}
                className="user-avatar "
            />
            <div className="user-detail justify-content-center">
                <h4 className="user-name d-flex" onClick={handleClick}>
                    <span className='text-truncate'>{displayName}</span>
                    <i className="zmdi zmdi-caret-down zmdi-hc-fw align-middle"/>
                </h4>

                <p className="mb-0 text-amber small">{<IntlMessages id={`roles.${role}`} />}</p>
                <p className="mb-0 text-teal small">{branchName}</p>
            </div>
            <Menu className="user-info"
                  id="simple-menu"
                  anchorEl={anchorE1}
                  open={open}
                  onClose={handleRequestClose}
                  PaperProps={{
                      style: {
                          minWidth: 120,
                          paddingTop: 0,
                          paddingBottom: 0
                      }
                  }}
            >
                <MenuItem onClick={handleRequestClose}>
                    <i className="zmdi zmdi-account zmdi-hc-fw mr-2"/>
                    <IntlMessages id="popup.profile"/>
                </MenuItem>
                <MenuItem onClick={handleRequestClose}>
                    <i className="zmdi zmdi-settings zmdi-hc-fw mr-2"/>
                    <IntlMessages id="popup.setting"/>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleRequestClose();
                    dispatch(userSignOut());
                }}>
                    <i className="zmdi zmdi-sign-in zmdi-hc-fw mr-2"/>

                    <IntlMessages id="popup.logout"/>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default UserInfo;


