import { Stack } from '@mantine/core';
import Supermarkets from './Supermarkets';

const Hero = () => {
    return (
        <Stack gap='xl'>
            <h1 className='text-center font-bold text-3xl my-8'>
                Tu mejor precio en las principales cadenas
            </h1>
            <Supermarkets />
        </Stack>
    );
};

export default Hero;
