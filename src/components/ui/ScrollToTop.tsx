import { Affix, Button, Transition } from '@mantine/core';
import { MoveUp } from 'lucide-react';
import { useWindowScroll } from '@mantine/hooks';

const ScrollToTop = () => {
    const [scroll, scrollTo] = useWindowScroll();
    return (
        <Affix position={{ bottom: 50, right: 10 }}>
            <Transition transition='slide-up' mounted={scroll.y > 0}>
                {transitionStyles => (
                    <Button
                        style={transitionStyles}
                        onClick={() => scrollTo({ y: 0 })}
                    >
                        <MoveUp />
                    </Button>
                )}
            </Transition>
        </Affix>
    );
};

export default ScrollToTop;
