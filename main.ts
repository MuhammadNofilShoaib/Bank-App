#!/usr/bin/env node  
import inquirer from "inquirer";
import chalk from "chalk";

class Customer {
    static counter: number = 1000;
    accNo: number;
    name: string;
    age: number;
    gender: string;
    phone: number;
    balance: number;

    constructor(name: string, age: number, gender: string, phone: number) {
        this.accNo = Customer.counter++;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.phone = phone;
        this.balance = 1000;
    }

    private applyTax(amount: number) {
        return Math.floor(amount / 100); // Calculate the tax amount ($1 per $100)
    }

    private formatCurrency(amount: number) {
        return `$${amount.toFixed(2)}`;
    }

    viewBal() {
        console.log(chalk.blueBright(`\nBalance of ${this.name}: ${this.formatCurrency(this.balance)}`));
    }

    credit(amount: number) {
        if (amount <= 0) {
            console.log(chalk.redBright(`\nInvalid amount! Must be greater than zero.`));
            return;
        }
        let tax = this.applyTax(amount);
        this.balance += (amount - tax);
        console.log(chalk.greenBright(`\n${this.formatCurrency(amount)} credited successfully to ${this.name}`));
        console.log(chalk.blueBright(`Remaining Balance: ${this.formatCurrency(this.balance)}`));
    }

    withDraw(amount: number) {
        if (amount <= 0) {
            console.log(chalk.redBright(`\nInvalid amount! Must be greater than zero.`));
            return;
        }
        if (amount > this.balance) {
            console.log(chalk.redBright(`\nInsufficient balance!`));
            return;
        }
        let tax = this.applyTax(amount);
        this.balance -= (amount + tax);
        console.log(chalk.greenBright(`\n${this.formatCurrency(amount)} withdrawn successfully for ${this.name}`));
        console.log(chalk.blueBright(`Remaining Balance: ${this.formatCurrency(this.balance)}`));
    }

    status() {
        console.log(chalk.yellowBright(`\nAccount number: ${this.accNo}`));
        console.log(chalk.yellowBright(`Name: ${this.name}`));
        console.log(chalk.yellowBright(`Age: ${this.age}`));
        console.log(chalk.yellowBright(`Gender: ${this.gender}`));
        console.log(chalk.yellowBright(`Phone #: ${this.phone}`));
        console.log(chalk.yellowBright(`Balance: ${this.formatCurrency(this.balance)}`));
    }
}

class Bank {
    customers: Customer[];

    constructor() {
        this.customers = [];
    }

    addCustomer(name: string, age: number, gender: string, phone: number) {
        let customer = new Customer(name, age, gender, phone);
        this.customers.push(customer);
        console.log(chalk.greenBright(`\nAccount created successfully!`));
        customer.status();
    }

    viewBalance(accNo: number) {
        let customer = this.findCustomer(accNo);
        if (customer) {
            customer.viewBal();
        } else {
            console.log(chalk.redBright(`\nCustomer not found! Enter correct Account Number.`));
        }
    }

    credAmount(accNo: number, amount: number) {
        let customer = this.findCustomer(accNo);
        if (customer) {
            customer.credit(amount);
        } else {
            console.log(chalk.redBright(`\nCustomer not found! Enter correct Account Number.`));
        }
    }

    withDAmount(accNo: number, amount: number) {
        let customer = this.findCustomer(accNo);
        if (customer) {
            customer.withDraw(amount);
        } else {
            console.log(chalk.redBright(`\nCustomer not found! Enter correct Account Number.`));
        }
    }

    showStat(accNo: number) {
        let customer = this.findCustomer(accNo);
        if (customer) {
            customer.status();
        } else {
            console.log(chalk.redBright(`\nCustomer not found! Enter correct Account Number.`));
        }
    }

    findCustomer(accNo: number) {
        return this.customers.find(cus => cus.accNo === accNo);
    }
}

async function main() {
    console.log(chalk.cyanBright(`\nWelcome To The Best Bank:`));
    console.log(chalk.cyanBright(`-`.repeat(50) + `\n`));

    let myBank = new Bank();

    while (true) {
        let choice = await inquirer.prompt([
            {
                name: "choice",
                type: "list",
                message: "\nChoose an option:",
                choices: [
                    `Create Account`,
                    `Credit Money`,
                    `Withdraw Money`,
                    `View Account Status`,
                    `View Balance`,
                    `Exit`
                ],
                prefix: chalk.magentaBright('→')
            }
        ]);

        switch (choice.choice) {
            case `Create Account`:
                let inp1 = await inquirer.prompt([
                    {
                        name: "name",
                        type: "input",
                        message: "Enter your name:",
                        validate: value => value.trim() !== '' ? true : 'Name cannot be empty.',
                        prefix: chalk.magentaBright('→')
                    },
                    {
                        name: "age",
                        type: "input",
                        message: "Enter your age:",
                        validate: value => {
                            const num = Number(value);
                            return !isNaN(num) && num > 0 ? true : 'Please enter a valid age (greater than zero).';
                        },
                        prefix: chalk.magentaBright('→')
                    },
                    {
                        name: "gender",
                        type: "list",
                        message: "Select your gender:",
                        choices: [`Male`, `Female`],
                        prefix: chalk.magentaBright('→')
                    },
                    {
                        name: "mobNo",
                        type: "input",
                        message: "Enter your Phone #:",
                        validate: value => {
                            const num = Number(value);
                            return !isNaN(num) && value.trim() !== '' ? true : 'Please enter a valid phone number.';
                        },
                        prefix: chalk.magentaBright('→')
                    }
                ]);
                myBank.addCustomer(inp1.name, Number(inp1.age), inp1.gender, Number(inp1.mobNo));
                break;

            case `Credit Money`:
                let inp2 = await inquirer.prompt([
                    {
                        name: "accNo",
                        type: "input",
                        message: "Enter your Account Number:",
                        validate: value => {
                            const num = Number(value);
                            return !isNaN(num) && value.trim() !== '' ? true : 'Please enter a valid account number.';
                        },
                        prefix: chalk.magentaBright('→')
                    },
                    {
                        name: "amount",
                        type: "input",
                        message: "Enter Amount:",
                        validate: value => {
                            const num = Number(value);
                            return !isNaN(num) && num > 0 ? true : 'Please enter a valid amount (greater than zero).';
                        },
                        prefix: chalk.magentaBright('→')
                    }
                ]);
                myBank.credAmount(Number(inp2.accNo), Number(inp2.amount));
                break;

            case `Withdraw Money`:
                let inp3 = await inquirer.prompt([
                    {
                        name: "accNo",
                        type: "input",
                        message: "Enter your Account Number:",
                        validate: value => {
                            const num = Number(value);
                            return !isNaN(num) && value.trim() !== '' ? true : 'Please enter a valid account number.';
                        },
                        prefix: chalk.magentaBright('→')
                    },
                    {
                        name: "amount",
                        type: "input",
                        message: "Enter Amount:",
                        validate: value => {
                            const num = Number(value);
                            return !isNaN(num) && num > 0 ? true : 'Please enter a valid amount (greater than zero).';
                        },
                        prefix: chalk.magentaBright('→')
                    }
                ]);
                myBank.withDAmount(Number(inp3.accNo), Number(inp3.amount));
                break;

            case `View Account Status`:
                let inp4 = await inquirer.prompt([
                    {
                        name: "accNo",
                        type: "input",
                        message: "Enter your Account Number:",
                        validate: value => {
                            const num = Number(value);
                            return !isNaN(num) && value.trim() !== '' ? true : 'Please enter a valid account number.';
                        },
                        prefix: chalk.magentaBright('→')
                    }
                ]);
                myBank.showStat(Number(inp4.accNo));
                break;

            case `View Balance`:
                let inp5 = await inquirer.prompt([
                    {
                        name: "accNo",
                        type: "input",
                        message: "Enter your Account Number:",
                        validate: value => {
                            const num = Number(value);
                            return !isNaN(num) && value.trim() !== '' ? true : 'Please enter a valid account number.';
                        },
                        prefix: chalk.magentaBright('→')
                    }
                ]);
                myBank.viewBalance(Number(inp5.accNo));
                break;

            case `Exit`:
                console.log(chalk.redBright(`\nExiting...`));
                process.exit();
        }
    }
}

main();
