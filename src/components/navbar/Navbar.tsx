import { Group } from '@mantine/core';
import Cart from '../cart/Cart';

const Navbar = () => {
    return (
        <>
            <Group
                w={'100%'}
                justify='space-between'
                style={{ padding: '20px 0' }}
            >
                <h2 className='font-bold text-3xl'>
                    <span className='text-[#23bcfe]'>mi</span>
                    Ahorro
                </h2>
                <Cart />
            </Group>
        </>
    );
};

export default Navbar;
