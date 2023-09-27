import React, {useEffect} from "react";
import AppLayouts from "./AppLayouts";
import Routes from "../../app/routes";
import {useDispatch, useSelector} from "react-redux";

const AppLayout = () => {


    // const dispatch = useDispatch();
    // const {user, agency} = useSelector(({pax}) => pax);

    // console.log("user-user", user);

    // useEffect(() => {
    //     const setl = loader => dispatch(setLoader(loader));
    //     if(!user) {
    //         loadUser(setl, user => {
    //             dispatch(setValues({user}, true));
    //             console.log("user", user);
    //             const {bid} = user || {};
    //             // if(bid) loadBranch(bid, setl, branch => {
    //             //     dispatch(setValues({branch}, true));
    //             // })
    //         });
    //     }
    //
    //     const {aid, role} = user || {};
    //
    //     // console.log("role", role);
    //
    //     // if(!agency && aid) {
    //     //     loadAgency(aid, setl, agency => dispatch(setValues({agency}, true)));
    //     // }
    // }, [dispatch]);
    //

    const horizontalNavPosition = useSelector(({settings}) => settings.horizontalNavPosition);
    const navigationStyle = useSelector(({settings}) => settings.navigationStyle);
    const onGetLayout = (layout) => {
        switch (layout) {
            case "inside_the_header":
                return "InsideHeaderNav";

            case "above_the_header":
                return "AboveHeaderNav";

            case "below_the_header":
                return "BelowHeaderNav";
            default:
                return "Vertical";
        }
    };

    const Layout = AppLayouts[navigationStyle === "vertical_navigation" ? "Vertical" : onGetLayout(horizontalNavPosition)];




    return (
        <Layout>
            <Routes/>
        </Layout>
    );
};

export default AppLayout;
