        // Sample data for each species
        const sampleData = {
            setosa: { sepalLength: 5.1, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.2 },
            versicolor: { sepalLength: 7.0, sepalWidth: 3.2, petalLength: 4.7, petalWidth: 1.4 },
            virginica: { sepalLength: 6.3, sepalWidth: 3.3, petalLength: 6.0, petalWidth: 2.5 }
        };

        // Species information
        const speciesInfo = {
            setosa: {
                emoji: "🌸",
                description: "Iris Setosa - Known for small petals and robust sepals"
            },
            versicolor: {
                emoji: "🌿", 
                description: "Iris Versicolor - Medium-sized flowers with moderate proportions"
            },
            virginica: {
                emoji: "🌺",
                description: "Iris Virginica - Large flowers with long petals"
            }
        };

        // Simple iris classification logic (basic decision tree)
        function predictIrisSpecies(data) {
            const { sepalLength, sepalWidth, petalLength, petalWidth } = data;
            
            // Simple decision tree based on typical iris characteristics
            let probabilities = { setosa: 0, versicolor: 0, virginica: 0 };
            
            // Setosa typically has small petals
            if (petalLength <= 2.0 && petalWidth <= 0.6) {
                probabilities.setosa = 0.85 + Math.random() * 0.1;
                probabilities.versicolor = 0.08 + Math.random() * 0.05;
                probabilities.virginica = 1 - probabilities.setosa - probabilities.versicolor;
            }
            // Virginica typically has large petals
            else if (petalLength >= 4.5 && petalWidth >= 1.5) {
                probabilities.virginica = 0.80 + Math.random() * 0.15;
                probabilities.versicolor = 0.12 + Math.random() * 0.05;
                probabilities.setosa = 1 - probabilities.virginica - probabilities.versicolor;
            }
            // Versicolor is in between
            else {
                probabilities.versicolor = 0.75 + Math.random() * 0.15;
                probabilities.setosa = 0.10 + Math.random() * 0.10;
                probabilities.virginica = 1 - probabilities.versicolor - probabilities.setosa;
            }

            // Normalize probabilities
            const sum = probabilities.setosa + probabilities.versicolor + probabilities.virginica;
            probabilities.setosa /= sum;
            probabilities.versicolor /= sum;
            probabilities.virginica /= sum;

            // Determine predicted species
            let predictedSpecies = 'setosa';
            let maxProb = probabilities.setosa;
            
            if (probabilities.versicolor > maxProb) {
                predictedSpecies = 'versicolor';
                maxProb = probabilities.versicolor;
            }
            if (probabilities.virginica > maxProb) {
                predictedSpecies = 'virginica';
                maxProb = probabilities.virginica;
            }

            return {
                species: predictedSpecies,
                confidence: maxProb,
                probabilities
            };
        }

        // Get form elements
        const form = document.getElementById('irisForm');
        const predictBtn = document.getElementById('predictBtn');
        const inputs = {
            sepalLength: document.getElementById('sepalLength'),
            sepalWidth: document.getElementById('sepalWidth'),
            petalLength: document.getElementById('petalLength'),
            petalWidth: document.getElementById('petalWidth')
        };

        // Get state elements
        const defaultState = document.getElementById('defaultState');
        const loadingState = document.getElementById('loadingState');
        const resultsState = document.getElementById('resultsState');
        const resultDescription = document.getElementById('resultDescription');

        // Get result elements
        const resultEmoji = document.getElementById('resultEmoji');
        const resultSpecies = document.getElementById('resultSpecies');
        const resultConfidence = document.getElementById('resultConfidence');
        const resultSpeciesDescription = document.getElementById('resultSpeciesDescription');

        // Get probability elements
        const setosaValue = document.getElementById('setosaValue');
        const setosaBar = document.getElementById('setosaBar');
        const versicolorValue = document.getElementById('versicolorValue');
        const versicolorBar = document.getElementById('versicolorBar');
        const virginicaValue = document.getElementById('virginicaValue');
        const virginicaBar = document.getElementById('virginicaBar');

        // Sample button handlers
        document.querySelectorAll('[data-sample]').forEach(button => {
            button.addEventListener('click', () => {
                const species = button.dataset.sample;
                const sample = sampleData[species];
                
                inputs.sepalLength.value = sample.sepalLength;
                inputs.sepalWidth.value = sample.sepalWidth;
                inputs.petalLength.value = sample.petalLength;
                inputs.petalWidth.value = sample.petalWidth;
            });
        });

        // Form submission handler
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const data = {
                sepalLength: parseFloat(inputs.sepalLength.value),
                sepalWidth: parseFloat(inputs.sepalWidth.value),
                petalLength: parseFloat(inputs.petalLength.value),
                petalWidth: parseFloat(inputs.petalWidth.value)
            };

            // Validation
            const values = Object.values(data);
            if (values.some(val => val <= 0 || val > 20 || isNaN(val))) {
                alert('Please enter valid measurements between 0.1 and 20.0 cm');
                return;
            }

            // Show loading state
            showLoading();

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Get prediction
            const prediction = predictIrisSpecies(data);

            // Show results
            showResults(prediction);
        });

        function showLoading() {
            defaultState.classList.add('hidden');
            resultsState.classList.add('hidden');
            loadingState.classList.remove('hidden');
            
            // Disable form
            const formElements = form.querySelectorAll('input, button');
            formElements.forEach(el => el.disabled = true);
            
            predictBtn.innerHTML = `
                <div class="spinner" style="width: 1rem; height: 1rem; margin-right: 0.5rem;"></div>
                Analyzing...
            `;
        }

        function showResults(prediction) {
            loadingState.classList.add('hidden');
            defaultState.classList.add('hidden');
            resultsState.classList.remove('hidden');
            
            // Enable form
            const formElements = form.querySelectorAll('input, button');
            formElements.forEach(el => el.disabled = false);
            
            predictBtn.innerHTML = 'Predict Species';
            
            // Update description
            resultDescription.textContent = 'Classification results';
            
            // Update result display
            const info = speciesInfo[prediction.species];
            resultEmoji.textContent = info.emoji;
            resultSpecies.textContent = `Iris ${prediction.species}`;
            resultConfidence.textContent = `${(prediction.confidence * 100).toFixed(1)}% confidence`;
            resultSpeciesDescription.textContent = info.description;
            
            // Update probabilities
            const probabilities = [
                { key: 'setosa', value: setosaValue, bar: setosaBar },
                { key: 'versicolor', value: versicolorValue, bar: versicolorBar },
                { key: 'virginica', value: virginicaValue, bar: virginicaBar }
            ];
            
            probabilities.forEach(({ key, value, bar }) => {
                const percentage = (prediction.probabilities[key] * 100).toFixed(1);
                value.textContent = `${percentage}%`;
                bar.style.width = `${percentage}%`;
            });
        }