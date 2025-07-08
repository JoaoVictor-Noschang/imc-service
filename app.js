const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002;

app.use(cors());

// parsear JSON no corpo das requisições
app.use(express.json());

// Função de cálculo de IMC
const calcularImcValue = (peso, altura) => {
    const numPeso = parseFloat(peso);
    const numAltura = parseFloat(altura);

    if (isNaN(numPeso) || isNaN(numAltura) || numPeso <= 0 || numAltura <= 0) {
        return null;
    }

    const result = numPeso / (numAltura * numAltura);
    return parseFloat(result.toFixed(2));
};

// Função para obter a observação do IMC
const getImcObservation = (imcValue) => {
    if (imcValue === null || isNaN(imcValue)) return 'Dados inválidos';
    if (imcValue < 18.5) return 'Abaixo do peso';
    if (imcValue < 24.9) return 'Peso normal';
    if (imcValue < 29.9) return 'Sobrepeso';
    if (imcValue < 34.9) return 'Obesidade Grau I';
    if (imcValue < 39.9) return 'Obesidade Grau II';
    return 'Obesidade Grau III';
};

// Rota da API para calcular o IMC
app.post('/calculate-imc', (req, res) => {
    const { peso, altura } = req.body;

    if (peso === undefined || altura === undefined) {
        return res.status(400).json({ error: 'Peso e altura são obrigatórios.' });
    }

    const imc = calcularImcValue(peso, altura);

    if (imc === null) {
        return res.status(400).json({ error: 'Valores inválidos para peso ou altura.' });
    }

    const observation = getImcObservation(imc);

    res.status(200).json({
        imc: imc,
        observation: observation,
        message: 'Cálculo de IMC realizado com sucesso.'
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Microserviço de IMC rodando em http://localhost:${port}`);
});