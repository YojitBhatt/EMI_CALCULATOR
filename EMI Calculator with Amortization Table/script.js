function calculateEMI(principal, annualRate, tenureMonths) {
    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return emi;
}

function generateAmortizationTable(principal, annualRate, tenureMonths, emi) {
    let balance = principal;
    const monthlyRate = annualRate / 12 / 100;
    let tableRows = '';

    for (let month = 1; month <= tenureMonths; month++) {
        const interest = balance * monthlyRate;
        const principalPaid = emi - interest;
        const prevBalance = balance;
        balance -= principalPaid;
        if (balance < 0) balance = 0;

        tableRows += `
            <tr>
                <td>${month}</td>
                <td>&#8377;${prevBalance.toFixed(2)}</td>
                <td>&#8377;${emi.toFixed(2)}</td>
                <td>&#8377;${principalPaid.toFixed(2)}</td>
                <td>&#8377;${interest.toFixed(2)}</td>
                <td>&#8377;${balance.toFixed(2)}</td>
            </tr>
        `;
    }

    return `
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Opening<br>Balance</th>
                    <th>EMI</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Closing<br>Balance</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
}

document.getElementById('emiForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const tenure = parseInt(document.getElementById('tenure').value, 10);

    if (principal <= 0 || rate <= 0 || tenure <= 0) {
        document.getElementById('emiResult').innerHTML = '<span style="color:red;">Please enter valid values.</span>';
        document.getElementById('amortization').innerHTML = '';
        return;
    }

    const emi = calculateEMI(principal, rate, tenure);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - principal;

    document.getElementById('emiResult').innerHTML = `
        <div>Monthly EMI: <b>&#8377;${emi.toFixed(2)}</b></div>
        <div>Total Payment: <b>&#8377;${totalPayment.toFixed(2)}</b></div>
        <div>Total Interest: <b>&#8377;${totalInterest.toFixed(2)}</b></div>
    `;

    document.getElementById('amortization').innerHTML = generateAmortizationTable(principal, rate, tenure, emi);
});