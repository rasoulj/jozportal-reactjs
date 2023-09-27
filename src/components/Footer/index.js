import React from 'react';
import Button from '@material-ui/core/Button';
import IntlMessages from 'util/IntlMessages';
import {getCopyrightTitle} from "../../constants";
import {useSelector} from "react-redux";
import {DEF_AGENCY} from "../../util/loacalDB";

const Footer = () => {
    const {agency} = useSelector(({pax}) => pax);
    const {copyrightTitle} = agency || DEF_AGENCY;

    return (
            <footer className="app-footer">
                {/*<span className="d-inline-block"><IntlMessages id="footer.copyright" /></span>*/}
                <span className="d-inline-block">{copyrightTitle}</span>
                <Button
                    href="http://www.google.com"
                    target="_blank"
                    size="small"
                    color="primary"
                ><IntlMessages id="footer.contactUs"/></Button>
            </footer>
        );
    }
;

export default Footer;
