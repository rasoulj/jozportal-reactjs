import React, {useState} from 'react';
import {BasePage, NoData} from "../../../components/TinyComponents";

export default ({match}) => {
    const [loader, setLoader] = useState(false);

    return <BasePage
        loader={loader}
        tid="pages.wallet.transactions"
        match={match}>
        <NoData />
    </BasePage>;
};

