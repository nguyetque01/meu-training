using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using backend.Models;

namespace backend.Helpers
{
    public class SearchHelper
    {
        private char[] punctuationMarks = { ' ', '-', ':', ',', '.', '?', '!' };
        private List<string> validColumns = new List<string> { "Id", "Code", "Name", "Category", "Brand", "Type", "Description" };

        public IQueryable<Product> ApplyProductSearchFilter(IQueryable<Product> query, string search, string searchColumn)
        {
            string formattedSearch = search.ToLower();

            if (string.IsNullOrEmpty(searchColumn) || searchColumn.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                var filteredQuery = query.Where(BuildSearchCondition(), formattedSearch);

                foreach (var product in filteredQuery.ToList())
                {
                    foreach (var column in validColumns)
                    {
                        UpdateProductSearchMatches(product, column, formattedSearch);
                    }
                }

                return filteredQuery;
            }
            else if (validColumns.Contains(searchColumn, StringComparer.OrdinalIgnoreCase))
            {
                var filteredQuery = query.Where(BuildSearchCondition(searchColumn), formattedSearch);

                foreach (var product in filteredQuery.ToList())
                {
                    UpdateProductSearchMatches(product, searchColumn, formattedSearch);
                }

                return filteredQuery;
            }
            else
            {
                throw new ArgumentException("Invalid search column");
            }
        }

        private void UpdateProductSearchMatches(Product product, string column, string search)
        {
            string value = (product.GetType().GetProperty(column)?.GetValue(product, null)?.ToString()?.ToLower()) ?? "default";
            List<int> foundPositions = new List<int>();

            var words = value.Split(' ');
            int searchLength = search.Split(' ').Length;
            int textLength = words.Length;

            for (int i = 0; i < textLength - searchLength + 1; i++)
            {
                string[] subWords = words.Skip(i).Take(searchLength).ToArray();
                string subText = string.Join(" ", subWords);

                if (IsMatchCondition(search, subText))
                {
                    foundPositions.Add(i);
                }
            }

            if (foundPositions.Any())
            {
                if (!product.SearchMatches.ContainsKey(column))
                {
                    product.SearchMatches[column] = foundPositions;
                }
                else
                {
                    product.SearchMatches[column].AddRange(foundPositions);
                }
            }
        }

        private string BuildSearchCondition(string? column = null)
        {
            List<string> conditions = new List<string>();

            if (column == null)
            {
                foreach (string col in validColumns)
                {
                    conditions.Add(BuildConditionExpression(col));
                }
            }
            else
            {
                conditions.Add(BuildConditionExpression(column));
            }

            return string.Join(" || ", conditions);
        }

        private string BuildConditionExpression(string column)
        {
            string processedColumn = $"{column}.ToString().ToLower()";
            List<string> conditionParts = new List<string>();

            foreach (char punctuationMark in punctuationMarks)
            {
                conditionParts.Add($"{processedColumn}.Equals(@0)");
                conditionParts.Add($"{processedColumn}.StartsWith(@0 + \"{punctuationMark}\")");
                conditionParts.Add($"{processedColumn}.EndsWith(\"{punctuationMark}\" + @0)");
                conditionParts.Add($"{processedColumn}.Contains(\" \" + @0 + \"{punctuationMark}\")");
            }

            return string.Join(" || ", conditionParts);
        }

        private bool IsMatchCondition(string search, string text)
        {
            string processedSearch = search.ToLower();
            string processedText = text.ToLower();

            foreach (char punctuationMark in punctuationMarks)
            {
                if (processedText.Equals(processedSearch) ||
                    processedText.StartsWith(processedSearch + punctuationMark) ||
                    processedText.EndsWith(punctuationMark + processedSearch) ||
                    processedText.Contains(" " + processedSearch + punctuationMark))
                {
                    return true;
                }
            }

            return false;
        }
    }
}