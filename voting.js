const fs = require('fs');
const readlineSync = require('readline-sync');
const bcrypt = require('bcryptjs');
const votesFilePath = './votes.json';

// Function to load votes from the JSON file
function loadVotes() {
    if (fs.existsSync(votesFilePath)) {
        const data = fs.readFileSync(votesFilePath);
        return JSON.parse(data);
    }
    return [];
}

// Function to save votes to the JSON file
function saveVotes(votes) {
    fs.writeFileSync(votesFilePath, JSON.stringify(votes, null, 2));
}

// Function to cast a vote
async function castVote(voterId, candidate) {
    // Hash the voter ID for privacy
    const hashedVoterId = await bcrypt.hash(voterId, 10);

    const vote = { voterId: hashedVoterId, candidate };

    // Load existing votes, add the new one, and save them back
    let votes = loadVotes();
    votes.push(vote);
    saveVotes(votes);
}

// Function to display the results
function displayResults() {
    let voteCounts = {};
    const votes = loadVotes();

    votes.forEach(vote => {
        if (voteCounts[vote.candidate]) {
            voteCounts[vote.candidate]++;
        } else {
            voteCounts[vote.candidate] = 1;
        }
    });

    console.log("Election Results:");
    for (const [candidate, count] of Object.entries(voteCounts)) {
        console.log(`${candidate}: ${count} vote(s)`);
    }
}

// Main function to run the voting system
async function main() {
    console.log("Welcome to the Electronic Voting System");
    const voters = ['voter1', 'voter2', 'voter3']; // Example voter IDs
    const candidates = ['Alice', 'Bob', 'Charlie']; // Example candidates

    for (let voter of voters) {
        console.log(`\n${voter}, it's your turn to vote.`);
        const index = readlineSync.keyInSelect(candidates, 'Choose your candidate:');
        if (index !== -1) {
            await castVote(voter, candidates[index]);
        } else {
            console.log(`${voter} chose not to vote.`);
        }
    }

    console.log("\nVoting has ended.\n");
    displayResults();
}

main();