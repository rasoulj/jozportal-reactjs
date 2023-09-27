import React from 'react';
import {BasePage} from "../../../components/TinyComponents";

import {useIntl} from "react-intl";
import {Tran} from "../../../lngProvider";
import {appVer} from "../../../constants";
import {useSelector} from "react-redux";
import {baseApiUrl} from "../../../util/db_mongo";

const style = "mt-3 mb-3 text-center";


export default ({match}) => {
    const {locale} = useIntl();
    const {user, agency} = useSelector(({pax}) => pax);
    const {wid} = user || {wid: "NA"};

    const {webUrl, supportEmail, supportTel, logo3, mainTitle, displayName, uid} = agency || {};

    return <BasePage
        //TODO: tid="pages.about_us"
        title={displayName}
        match={match}>


        {/*<ReactMarkdown plugins={[gfm]} children={markdown}  />*/}

        <div className="d-flex flex-column justify-content-center">
            <div className="align-self-center">
                <img src={`${baseApiUrl}/${logo3}`} style={{width: 160}} alt={uid}/>
            </div>
            {/*<h1 className={style+ " mt-0 pt-0 pb-3"}>{Tran("about-us.h1", locale)}</h1>*/}
            <h1 className={style+ " mt-0 pt-0 pb-3"}>{mainTitle}</h1>
            <div className="w-100 d-flex align-content-center flex-column">
                <div className="text-center p-2 align-self-center">
                    {/*<QRCode value={contactUsCard} />*/}
                    <img src={require("../../../assets/qr-code.png")} />
                </div>
            </div>
            <a className={style} href={webUrl}>{webUrl}</a>
            {/*<h4 className={style}>{Tran("about-us.h4", locale)}</h4>*/}

            <a className={style} href={"mailto:"+supportEmail}>{supportEmail}</a>
            <a className={style} dir="ltr" href={"tel:"+supportTel}>{supportTel}</a>
            <p className={style}>{Tran("about-us.ver", locale)} {appVer}</p>

        </div>

    </BasePage>;
};

