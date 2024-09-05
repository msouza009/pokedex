import express, { Request, Response, response } from "express";
import path from "path";

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));

// Função para buscar dados de um Pokémon
async function fetchPokemonDetails(pokemonUrl: string) {
    const response = await fetch(pokemonUrl);
    const data = await response.json();
    return data;
}

// Rota principal que lista todos os Pokémon com detalhes adicionais
app.get('/', async function (request: Request, response: Response) {
    try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=12");
        const data = await res.json();

        // Buscando detalhes de cada Pokémon
        const pokemonDetailsPromises = data.results.map((pokemon: { url: string }) => fetchPokemonDetails(pokemon.url));
        const pokemonDetails = await Promise.all(pokemonDetailsPromises);

        response.render("index", { results: pokemonDetails });
    } catch (error) {
        console.error(error);
        response.status(500).send("Erro ao buscar dados do Pokémon.");
    }
});

app.get('/detalhes/:name', async function (request: Request, response: Response) {
    try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1");
        const data = await res.json();

        // Buscando detalhes de cada Pokémon
        const pokemonDetailsPromises = data.results.map((pokemon: { url: string }) => fetchPokemonDetails(pokemon.url));
        const pokemonDetails = await Promise.all(pokemonDetailsPromises);

        response.render("index", { results: pokemonDetails });
    } catch (error) {
        console.error(error);
        response.status(500).send("Erro ao buscar dados do Pokémon.");
    }
});

app.listen(3000, function () {
    console.log("Server is running");
});