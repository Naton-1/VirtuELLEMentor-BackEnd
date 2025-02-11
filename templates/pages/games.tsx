import Layout from '@/components/Layouts/Layout';
import { useMemo } from 'react';
import Select, { SingleValue } from 'react-select';

import AnimelleGameImage from '@/public/static/images/animellegame.png';
import CardGameImage from '@/public/static/images/cardgame.png';
import HellesKitchenImage from '@/public/static/images/helleskitchen.png';
import HighRiseImage from '@/public/static/images/highrise.jpg';
import MazeGameImage from '@/public/static/images/mazeGameplay.png';
import MillenIElleImage from '@/public/static/images/milleniimage.png';
import PastaGameImage from '@/public/static/images/pastakerfuffle.png';
import SpinNSpellImage from '@/public/static/images/spinnspellBlocks.png';
import TalkWithTitoImage from '@/public/static/images/talkwithtito.png'

import GameSectionJSON from '@/public/static/json/gameSections.json';

import GameSection from '@/components/Games/GameSection';
import '@/lib/font-awesome/css/font-awesome.min.css';
import '@/lib/ionicons/css/ionicons.min.css';
import '@/lib/owlcarousel/assets/owl.carousel.min.css';
import '@/public/static/css/style.css';

type GameOption = {
    value: string;
    label: string;
};

export default function Games() {
    const handleGameChange = (selectedOption: SingleValue<GameOption>) => {
        if (!selectedOption) return;
        const value = selectedOption.value;
        const element = document.getElementById(value);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const anchorToImage = (anchor: string) => {
        switch (anchor) {
            case 'PastaKerfuffELLE':
                return PastaGameImage;
            case 'VirtuELLEMentor':
                return CardGameImage;
            case 'AnimELLE':
                return AnimelleGameImage;
            case 'Maze':
                return MazeGameImage;
            case 'HELLEsKitchen':
                return HellesKitchenImage;
            case 'SpinNSpELLE':
                return SpinNSpellImage;
            case 'HighriseHELLEp':
                return HighRiseImage;
            case 'Millenielle':
                return MillenIElleImage;
            case 'TalkWithTito':
                return TalkWithTitoImage;
            default:
                return CardGameImage;
        }
    };

    // Modify the JSON to add more games. The JSON is located at public/static/json/gameSections.json
    const GameSectionProps = useMemo(() => {
        return GameSectionJSON.map((game, idx) => {
            return {
                ...game,
                color: idx % 2 === 0 ? '#3f6184' : '#5da8af',
                buttonColor: idx % 2 === 0 ? '#5da8af' : '#3f6184',
                image: anchorToImage(game.anchor)
            };
        });
    }, []);

    const options = useMemo(() => GameSectionProps.map((game) => ({ value: game.anchor, label: game.title })), [GameSectionProps]);

    return (
        <div className='gamesBg'>
            <a id='top'></a>
            <div style={{ marginTop: 24 }}>
                <Select className='dropdown button' options={options} onChange={(e) => handleGameChange(e)} placeholder='Select a Game' />
            </div>

            {GameSectionProps.map((game, idx) => (
                <GameSection key={game.anchor} {...game} />
            ))}
        </div>
    );
}
