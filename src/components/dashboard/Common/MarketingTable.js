import React from 'react';
import MarketingTableCell from './MarketingTableCell';

export const marketingData = [
    {
        id: 1,
        name: '100-200-300',
        desc: '2020, Aug 17',
        icon: 'card-membership',
        color: 'bg-indigo lighten-1',
        budget: 570,
        growth: 20
    },

    {
        id: 2,
        name: '101-201-301',
        desc: '2020, Aug 18',
        icon: 'card',
        color: 'bg-light-blue accent-2',
        budget: 811,
        growth: -5
    },

    {
        id: 3,
        name: '102-202-302',
        desc: '2020, Sep 18',
        icon: 'card',
        color: 'bg-brown lighten-1',
        budget: 685,
        growth: 20
    },

    {
        id: 4,
        name: '103-203-303',
        desc: '2020, Aug 22',
        icon: 'card-alert',
        color: 'bg-light-blue darken-3',
        budget: 868,
        growth: 25
    },
    {
        id: 5,
        name: '104-204-304',
        desc: '2020, Aug 18',
        icon: 'card-travel',
        color: 'bg-red accent-4',
        budget: 780,
        growth: -45
    },

    {
        id: 6,
        name: '105-206-308',
        desc: '2020, Aug 19',
        icon: 'card-travel',
        color: 'bg-pink lighten-2',
        budget: 868,
        growth: -125
    },

];

export const browserList = [
    {
        id: 1,
        image: 'https://via.placeholder.com/40x40',
        title: 'Firefox',
        subTitle: '14,500 user'
    }, {
        id: 2,
        image: 'https://via.placeholder.com/40x40',
        title: 'Google Chrome',
        subTitle: '14,500 user'
    },
    {
        id: 3,
        image: 'https://via.placeholder.com/40x40',
        title: 'Safari',
        subTitle: '14,500 user'
    }, {
        id: 4,
        image: 'https://via.placeholder.com/40x40',
        title: 'Internet Explorer',
        subTitle: '14,500 user'
    }
];

const MarketingTable = ({data}) => {
    return (
        <div className="table-responsive-material markt-table">
            <table className="table default-table table-sm full-table remove-table-border table-hover mb-0">
                <tbody>
                {data.map(data => {
                    return (
                        <MarketingTableCell key={data.id} data={data}/>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default MarketingTable;