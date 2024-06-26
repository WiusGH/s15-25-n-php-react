import { useEffect, useState } from "react";
import Card from "./Card";
import Chat from "./Chat";
import "./Card.css";

type Carta = {
  valor: string;
  palo: string;
  src: string;
};

const puntosTruco: { [key: string]: number } = {
  "1Espadas": 13,
  "1Bastos": 12,
  "7Espadas": 11,
  "7Oros": 10,
  "3": 9,
  "2": 8,
  "1Oros": 7,
  "1Copas": 7,
  "12": 6,
  "11": 5,
  "10": 4,
  "7Bastos": 3,
  "7Copas": 3,
  "6": 2,
  "5": 1,
  "4": 0,
};

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const obtenerMazo = (): Carta[] => {
  const palos = ["Espadas", "Bastos", "Oros", "Copas"];
  const valores = ["1", "2", "3", "4", "5", "6", "7", "10", "11", "12"];
  const mazo: Carta[] = [];

  palos.forEach((palo) => {
    valores.forEach((valor) => {
      mazo.push({
        valor,
        palo,
        src: `../../../public/images/cartas/${valor}${palo}.jpg`,
      });
    });
  });

  return shuffle(mazo);
};

const repartirCartas = (mazo: Carta[]): [Carta[], Carta[]] => {
  const jugador = mazo.slice(0, 3);
  const computadora = mazo.slice(3, 6);
  return [jugador, computadora];
};

function obtenerValorCarta(carta: Carta): number {
  const claveEspecial = `${carta.valor}${carta.palo}`;
  return puntosTruco[claveEspecial] ?? puntosTruco[carta.valor] ?? 0;
}

function seleccionarCartaComputadora(
  cartasComputadora: Carta[],
  cartaJugador: Carta
): Carta {
  const valorCartaJugador = obtenerValorCarta(cartaJugador);
  let cartaSeleccionada: Carta | null = null;

  for (const carta of cartasComputadora) {
    const valorCarta = obtenerValorCarta(carta);
    if (valorCarta > valorCartaJugador) {
      if (
        !cartaSeleccionada ||
        valorCarta < obtenerValorCarta(cartaSeleccionada)
      ) {
        cartaSeleccionada = carta;
      }
    }
  }

  if (!cartaSeleccionada) {
    cartaSeleccionada = cartasComputadora.reduce((menorCarta, carta) =>
      obtenerValorCarta(carta) < obtenerValorCarta(menorCarta)
        ? carta
        : menorCarta
    );
  }

  return cartaSeleccionada;
}

// function seleccionarCartaMenor(cartasComputadora: Carta[]): Carta {
//   return cartasComputadora.reduce((menorCarta, carta) =>
//     obtenerValorCarta(carta) < obtenerValorCarta(menorCarta)
//       ? carta
//       : menorCarta
//   );
// }

const TrucoGame: React.FC = () => {
  const [jugador, setJugador] = useState<Carta[]>([]);
  const [computadora, setComputadora] = useState<Carta[]>([]);
  const [jugadorInicial, setJugadorInicial] = useState<Carta[]>([]);
  const [computadoraInicial, setComputadoraInicial] = useState<Carta[]>([]);
  const [turnoJugador, setTurnoJugador] = useState(true);
  const [jugadas, setJugadas] = useState<{
    jugador: Carta[];
    computadora: Carta[];
  }>({ jugador: [], computadora: [] });
  const [chat, setChat] = useState<string[]>([]);
  const [envidoCantado, setEnvidoCantado] = useState(false);
  const [esperandoRespuestaEnvido, setEsperandoRespuestaEnvido] =
    useState(false);
  const [trucoCantado, setTrucoCantado] = useState(false);
  const [esperandoRespuestaTruco, setEsperandoRespuestaTruco] = useState(false);

  console.log(esperandoRespuestaTruco); // Agregué esta línea solo para poder desplegar

  useEffect(() => {
    reiniciarJuego();
  }, []);

  const calcularEnvido = (mano: Carta[]): number => {
    const puntos: { [key: string]: number } = {
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "10": 0,
      "11": 0,
      "12": 0,
    };

    const envidos: number[] = [];

    for (let i = 0; i < mano.length; i++) {
      for (let j = i + 1; j < mano.length; j++) {
        if (mano[i].palo === mano[j].palo) {
          const envido = puntos[mano[i].valor] + puntos[mano[j].valor] + 20;
          envidos.push(envido);
        }
      }
    }

    if (envidos.length === 0) {
      return Math.max(...mano.map((carta) => puntos[carta.valor]));
    }

    return Math.max(...envidos);
  };

  const handleComputadoraTiraCarta = () => {
    setTimeout(() => {
      let cartaComputadora: Carta;
      if (jugadas.jugador.length > 0) {
        const cartaJugador = jugadas.jugador[jugadas.jugador.length - 1];
        cartaComputadora = seleccionarCartaComputadora(
          computadora,
          cartaJugador
        );
      } else {
        cartaComputadora = seleccionarCartaComputadora(computadora, {
          valor: "0",
          palo: "",
          src: "",
        });
      }

      const nuevasCartasComputadora = computadora.filter(
        (carta) => carta !== cartaComputadora
      );
      setComputadora(nuevasCartasComputadora);
      setJugadas((prevJugadas) => ({
        jugador: [...prevJugadas.jugador],
        computadora: [...prevJugadas.computadora, cartaComputadora],
      }));
      setTurnoJugador(true);
    }, 1000);
  };

  const handleComputadoraCantaEnvido = () => {
    if (!envidoCantado) {
      const envidoComputadora = calcularEnvido(computadoraInicial);
      if (envidoComputadora >= 25) {
        setChat([...chat, "Computadora: Envido"]);
        setEnvidoCantado(true);
        setEsperandoRespuestaEnvido(true);
        setTurnoJugador(true);
      } else {
        handleComputadoraTiraCarta();
      }
    } else {
      handleComputadoraTiraCarta();
    }
  };

  useEffect(() => {
    console.log(
      "Estado actual de esperandoRespuestaEnvido:",
      esperandoRespuestaEnvido
    );
  }, [esperandoRespuestaEnvido]);

  const handleCantarEnvido = () => {
    setChat([...chat, "Jugador: Envido"]);
    setTurnoJugador(false);
    setEnvidoCantado(true);
    setEsperandoRespuestaEnvido(true);

    setTimeout(() => {
      const envidoComputadora = calcularEnvido(computadoraInicial);
      const envidoJugador = calcularEnvido(jugadorInicial);

      if (envidoComputadora > 25 && envidoJugador < envidoComputadora) {
        setChat([
          ...chat,
          `Jugador: Envido`,
          "Computadora: Quiero",
          `Jugador: Mi envido es ${envidoJugador}`,
          `Computadora: ${envidoComputadora} son mejores`,
        ]);
      } else {
        if (envidoComputadora > 25 && envidoJugador > envidoComputadora) {
          setChat([
            ...chat,
            `Jugador: Envido`,
            "Computadora: Quiero",
            `Jugador: Mi envido es ${envidoJugador}`,
            `Computadora: Son buenas`,
          ]);
        } else {
          setChat([...chat, `Jugador: Envido`, `Computadora: No Quiero`]);
        }
      }
      setTurnoJugador(true);
    }, 1000);
  };

  const handleResponderEnvido = (respuesta: string) => {
    if (respuesta === "Quiero") {
      const envidoComputadora = calcularEnvido(computadoraInicial);
      const envidoJugador = calcularEnvido(jugadorInicial);

      if (envidoJugador >= envidoComputadora) {
        setChat([
          ...chat,
          "Jugador: Quiero",
          `Jugador: Mi envido es ${envidoJugador}`,
          `Computadora: Son buenas`,
        ]);
      } else {
        setChat([
          ...chat,
          "Jugador: Quiero",
          `Jugador: Mi envido es ${envidoJugador}`,
          `Computadora: ${envidoComputadora} son mejores`,
        ]);
      }
    } else {
      setChat([...chat, "Jugador: No Quiero"]);
    }
    setEnvidoCantado(true);
    setTurnoJugador(true);
    setEsperandoRespuestaEnvido(false);

    handleComputadoraTiraCarta();
  };

  const handleCantarTruco = () => {
    setChat([...chat, "Jugador: Truco"]);
    setTurnoJugador(false);
    setTrucoCantado(true);
    setEsperandoRespuestaTruco(true);

    setTimeout(() => {
      const valorMinimoAceptado = 8;
      const cartasDeValor = computadoraInicial.filter(
        (carta) => obtenerValorCarta(carta) >= valorMinimoAceptado
      );

      if (cartasDeValor.length >= 2) {
        setChat([...chat, `Jugador: Truco`, "Computadora: Quiero"]);
      } else {
        setChat([...chat, `Jugador: Truco`, `Computadora: No Quiero`]);
      }
      setTurnoJugador(true);
    }, 1000);
  };

  const handleResponderTruco = (respuesta: string) => {
    if (respuesta === "Quiero") {
      setChat([...chat, "Jugador: Quiero"]);
    } else {
      setChat([...chat, "Jugador: No Quiero"]);
    }
    setTrucoCantado(true);
    setTurnoJugador(true);
    setEsperandoRespuestaTruco(false);

    handleComputadoraTiraCarta();
  };

  const handleJugarCarta = (index: number) => {
    if (turnoJugador && jugador.length > 0) {
      const carta = jugador[index];
      const nuevasCartasJugador = jugador.filter((_, i) => i !== index);
      setJugador(nuevasCartasJugador);
      setJugadas((prevJugadas) => ({
        jugador: [...prevJugadas.jugador, carta],
        computadora: [...prevJugadas.computadora],
      }));
      setTurnoJugador(false);

      setTimeout(() => {
        handleComputadoraCantaEnvido();
      }, 1000);
    }
  };

  const renderizarCartasJugadas = () => {
    return (
      <div className="mesa">
        <div className="mesa-computadora">
          {jugadas.computadora.map((carta, index) => (
            <Card
              key={`computadora-${index}`}
              valor={carta.valor}
              palo={carta.palo}
              src={carta.src}
              // style={{ left: `${index * 20}px`, top: "50px" }}
            />
          ))}
        </div>
        <div className="mesa-jugador">
          {jugadas.jugador.map((carta, index) => (
            <Card
              key={`jugador-${index}`}
              valor={carta.valor}
              palo={carta.palo}
              src={carta.src}
              // style={{ left: `${index * 20}px`, top: "150px" }}
            />
          ))}
        </div>
      </div>
    );
  };

  const reiniciarJuego = () => {
    const baraja = obtenerMazo();
    const [cartasJugador, cartasComputadora] = repartirCartas(baraja);
    setJugador(cartasJugador);
    setComputadora(cartasComputadora);
    setJugadorInicial(cartasJugador);
    setComputadoraInicial(cartasComputadora);
    setTurnoJugador(true);
    setJugadas({ jugador: [], computadora: [] });
    setChat([]);
    setEnvidoCantado(false);
    setEsperandoRespuestaEnvido(false);
    setTrucoCantado(false);
    setEsperandoRespuestaTruco(false);
  };

  const debeDeshabilitarEnvido = (): boolean => {
    return (
      !envidoCantado &&
      jugadas.jugador.length === 1 &&
      jugadas.computadora.length === 1
    );
  };

  return (
    <div className="truco-game">
      <h1 className="title">Truco</h1>
      <div className="game">
        <div className="players">
          <div>
            <h2>Computadora</h2>
            <div className="cards">
              {computadora.map((carta, index) => (
                <Card
                  key={index}
                  valor={carta.valor}
                  palo={carta.palo}
                  src={`../../../public/images/cartas/back.svg`}
                  tapada
                />
              ))}
            </div>
          </div>
          <div>{renderizarCartasJugadas()}</div>
          <div>
            <h2>Jugador</h2>
            <div className="cards">
              {jugador.map((carta, index) => (
                <Card
                  key={index}
                  valor={carta.valor}
                  palo={carta.palo}
                  src={carta.src}
                  onClick={() => handleJugarCarta(index)}
                />
              ))}
            </div>
            <div className="selectButton">
              {!envidoCantado && (
                <button
                  className="button"
                  onClick={handleCantarEnvido}
                  disabled={debeDeshabilitarEnvido()}
                >
                  Envido
                </button>
              )}
              {!trucoCantado && (
                <button className="button" onClick={handleCantarTruco}>
                  Truco
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="chat2">
          <Chat messages={chat} />
        </div>
        {turnoJugador && esperandoRespuestaEnvido && (
          <div className="respuestaEnvido">
            <button
              className="button"
              onClick={() => handleResponderEnvido("Quiero")}
            >
              Quiero
            </button>
            <button
              className="button"
              onClick={() => handleResponderEnvido("No Quiero")}
            >
              No Quiero
            </button>
          </div>
        )}

        {!turnoJugador && chat.includes("Computadora: Truco") && (
          <div className="respuestaTruco">
            <button
              className="button"
              onClick={() => handleResponderTruco("Quiero")}
            >
              Quiero
            </button>
            <button
              className="button"
              onClick={() => handleResponderTruco("No Quiero")}
            >
              No Quiero
            </button>
          </div>
        )}
      </div>
      <div className="reiniciarJuego">
        <button className="button" onClick={reiniciarJuego}>
          Reiniciar Juego
        </button>
      </div>
    </div>
  );
};

export default TrucoGame;
