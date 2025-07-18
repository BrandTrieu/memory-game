import './imgcard.css'

export default function ImgCard({ pkmnId, pkmnName, pkmnSprite, handleClick }) {

    return (
        <div className="img-card" id={pkmnId} onClick={handleClick}>
            <img src={pkmnSprite} alt={pkmnName} className="pkmn-img"/>
            <p className="pkmn-text">{pkmnName}</p>
        </div>
    );
}
