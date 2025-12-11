import React from 'react';
import CodeBlock from '../../CodeBlock';

const TranscriptsDay8 = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Day 8: Function Parameters & Caesar Cipher</h2>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">1. Functions with Inputs</h3>
                    <p className="text-gray-300 mb-4">
                        Previously, we used simple functions like <code>def greet():</code>. Now, we learn to pass <strong>data</strong> into them.
                        This allows functions to do different things each time depending on the input.
                    </p>
                    <CodeBlock code={`# Simple Function
def greet():
    print("Hello")
    print("How do you do?")

# Function with Input
def greet_with_name(name):
    print(f"Hello {name}")
    print(f"How do you do {name}?")

greet_with_name("Angela")`} language="python" />
                    <p className="text-gray-300 mt-4">
                        The variable <code>name</code> is the <strong>parameter</strong>, and <code>"Angela"</code> is the <strong>argument</strong>.
                    </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-green-400 mb-4">2. Positional vs. Keyword Arguments</h3>
                    <p className="text-gray-300 mb-4">
                        When a function has multiple inputs, order matters by default (Positional). But you can also be specific (Keyword).
                    </p>
                    <CodeBlock code={`def greet_with(name, location):
    print(f"Hello {name}")
    print(f"What is it like in {location}?")

# Positional Arguments
greet_with("Jack", "London")
# Output: Hello Jack, What is it like in London?

# Keyword Arguments
greet_with(location="London", name="Angela")
# Output: Hello Angela, What is it like in London?`} language="python" />
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">3. Caesar Cipher: Encryption</h3>
                    <p className="text-gray-300 mb-4">
                        The Caesar Cipher is a simple substitution cipher where each letter is shifted by a fixed number.
                        E.g., shift 3: A &rarr; D, B &rarr; E.
                    </p>
                    <CodeBlock code={`alphabet = ['a', 'b', 'c', ..., 'z']

def encrypt(plain_text, shift_amount):
    cipher_text = ""
    for letter in plain_text:
        position = alphabet.index(letter)
        new_position = position + shift_amount
        new_letter = alphabet[new_position]
        cipher_text += new_letter
    print(f"The encoded text is {cipher_text}")`} language="python" />
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-red-400 mb-4">4. Handling Index Errors & Decryption</h3>
                    <p className="text-gray-300 mb-4">
                        What if the shift goes beyond 'z'? We need to wrap around. Also, decryption is just shifting backwards.
                    </p>
                    <CodeBlock code={`# Decryption Function
def decrypt(cipher_text, shift_amount):
    plain_text = ""
    for letter in cipher_text:
        position = alphabet.index(letter)
        # Wrap around logic could be done with % 26, or checking lists
        new_position = position - shift_amount
        plain_text += alphabet[new_position]
    print(f"The decoded text is {plain_text}")

# Combined Function
def caesar(start_text, shift_amount, cipher_direction):
    end_text = ""
    if cipher_direction == "decode":
            shift_amount *= -1
    for letter in start_text:
        position = alphabet.index(letter)
        # Using Modulo to handle wrap around
        new_position = (position + shift_amount) % 26
        end_text += alphabet[new_position]
    print(f"Here's the {cipher_direction}d result: {end_text}")`} language="python" />
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">5. Final Project: Caesar Cipher</h3>
                    <p className="text-gray-300 mb-4">
                        We combine everything into a polished program with a logo, a while loop to restart, and handling non-alphabet characters.
                    </p>
                    <CodeBlock code={`from art import logo
print(logo)

should_continue = True
while should_continue:
    direction = input("Type 'encode' or 'decode':\n")
    text = input("Type your message:\n").lower()
    shift = int(input("Type the shift number:\n"))

    caesar(start_text=text, shift_amount=shift, cipher_direction=direction)

    result = input("Type 'yes' if you want to go again. Otherwise type 'no'.\n")
    if result == "no":
        should_continue = False
        print("Goodbye")`} language="python" />
                </div>
            </div>
        </div>
    );
};

export default TranscriptsDay8;
