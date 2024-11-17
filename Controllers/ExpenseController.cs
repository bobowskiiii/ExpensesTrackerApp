using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using ExpenseTracker.Data;
using ExpenseTracker.Models;

[ApiController]
[Route("api/[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExpenseController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IEnumerable<Expense> Get()
    {
        return _context.Expenses.ToList();
    }

    [HttpPost]
    public IActionResult Post(Expense expense)
    {
        if (expense == null)
        {
            return BadRequest();
        }

        if (string.IsNullOrEmpty(expense.Description) || expense.Amount <= 0 || string.IsNullOrEmpty(expense.Category))
        {
            return BadRequest("Description, amount, and category are required.");
        }
        
        _context.Expenses.Add(expense);
        _context.SaveChanges();
        return Ok(expense);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
        {
            return NotFound();
        }
        Console.WriteLine($"Usuwanie rekordu o id: {id}");

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
        return Ok(expense);
    }
}